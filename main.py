import os
import asyncio
import httpx
import traceback
from datetime import datetime, timezone
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from supabase import create_client, Client  # pip install supabase

app = FastAPI(title="AI Companion Reminders (Resend Only, status-based)")

def must_env(name: str) -> str:
    v = os.getenv(name)
    if not v:
        raise RuntimeError(f"Missing required env var: {name}")
    return v

# Required envs
CRON_SECRET = must_env("CRON_SECRET")
SUPABASE_URL = must_env("SUPABASE_URL")
SUPABASE_SERVICE_ROLE = must_env("SUPABASE_SERVICE_ROLE")
RESEND_KEY = must_env("RESEND_API_KEY")
FROM_EMAIL = os.getenv("FROM_EMAIL", "no-reply@yourdomain.com")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

@app.get("/internal/health")
def health():
    return {"ok": True, "from_email": FROM_EMAIL}

async def send_email(to: str, subject: str, html: str):
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(
            "https://api.resend.com/emails",
            headers={"Authorization": f"Bearer {RESEND_KEY}"},
            json={"from": FROM_EMAIL, "to": [to], "subject": subject, "html": html},
        )
        r.raise_for_status()

def _now_iso():
    return datetime.now(timezone.utc).isoformat()

def _update_success(rem_id: str):
    # Try to set sent_at if column exists; otherwise fall back to just status/last_error
    try:
        supabase.table("reminders").update(
            {"status": "sent", "last_error": None, "sent_at": _now_iso()}
        ).eq("id", rem_id).execute()
    except Exception:
        supabase.table("reminders").update(
            {"status": "sent", "last_error": None}
        ).eq("id", rem_id).execute()

def _update_failure(rem_id: str, err: str):
    try:
        supabase.table("reminders").update(
            {"status": "failed", "last_error": err}
        ).eq("id", rem_id).execute()
    except Exception:
        pass

async def deliver(rem):
    to = rem.get("target")
    subject = f"Reminder: {rem.get('title', '(no title)')}"
    html = f"<p>{subject}</p><p>Scheduled at {rem.get('when_at')}</p>"
    try:
        await send_email(to, subject, html)
        _update_success(rem["id"])
        return True, None
    except Exception as e:
        err = f"{type(e).__name__}: {e}"
        _update_failure(rem["id"], err)
        traceback.print_exc()
        return False, err

@app.post("/internal/run-reminders")
async def run_reminders(req: Request):
    try:
        if req.query_params.get("secret") != CRON_SECRET:
            raise HTTPException(status_code=401, detail="bad secret")

        now = _now_iso()

        # STATUS-BASED SELECTION: no dependency on sent_at column
        # Pick reminders where status is 'pending' (or null) and when_at <= now
        # Note: PostgREST can't do OR easily in one call; do two and merge.
        pending = supabase.table("reminders").select("*").eq("status", "pending").lte("when_at", now).execute().data
        null_status = supabase.table("reminders").select("*").is_("status", None).lte("when_at", now).execute().data
        seen = set()
        due = []
        for r in pending + null_status:
            if r["id"] not in seen:
                seen.add(r["id"]); due.append(r)

        results = await asyncio.gather(*(deliver(r) for r in due), return_exceptions=False)
        sent = sum(1 for ok, _ in results if ok)
        errors = [err for ok, err in results if not ok and err]

        return {"checked": len(due), "sent": sent, "errors": len(errors), "details": errors[:3]}
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})
