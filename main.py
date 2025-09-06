import os
import asyncio
import httpx
import traceback
from datetime import datetime, timezone
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from supabase import create_client, Client
from postgrest.exceptions import APIError

app = FastAPI(title="AI Companion Reminders (Resend Only, flexible time column)")

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
TIME_COL_ENV = os.getenv("REMINDERS_TIME_COL")  # optional override

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

TIME_COL = None

def detect_time_col():
    global TIME_COL
    if TIME_COL_ENV:
        TIME_COL = TIME_COL_ENV
        return TIME_COL
    candidates = ["when_at", "due_at", "remind_at", "run_at"]
    for col in candidates:
        try:
            # light query that will 42703 if column doesn't exist
            supabase.table("reminders").select(col).limit(1).execute()
            TIME_COL = col
            return TIME_COL
        except APIError as e:
            # undefined column -> try next
            if e.code != "42703":
                # other errors, rethrow
                raise
    raise RuntimeError("Could not detect time column. Set REMINDERS_TIME_COL env or create one of: when_at, due_at, remind_at, run_at")

@app.get("/")
def home():
    return {"service": "AI Companion Reminders", "status": "running"}

@app.get("/internal/health")
def health():
    try:
        col = detect_time_col()
        return {"ok": True, "time_col": col, "from_email": FROM_EMAIL}
    except Exception as e:
        return JSONResponse(status_code=500, content={"ok": False, "error": str(e)})

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
    # Try to set sent_at if exists; otherwise ignore
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
    html = f"<p>{subject}</p><p>Scheduled at {rem.get(TIME_COL)}</p>"
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

        col = detect_time_col()
        now = _now_iso()

        # Fetch due reminders where status is 'pending' OR NULL and time_col <= now
        pending = supabase.table("reminders").select("*").eq("status", "pending").lte(col, now).execute().data
        null_status = supabase.table("reminders").select("*").is_("status", None).lte(col, now).execute().data

        # merge unique
        seen = set()
        due = []
        for r in pending + null_status:
            if r["id"] not in seen:
                seen.add(r["id"])
                due.append(r)

        results = await asyncio.gather(*(deliver(r) for r in due), return_exceptions=False)
        sent = sum(1 for ok, _ in results if ok)
        errors = [err for ok, err in results if not ok and err]

        return {"checked": len(due), "sent": sent, "errors": len(errors), "time_col": col, "details": errors[:3]}
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})
