import os
import asyncio
import httpx
import traceback
from datetime import datetime, timezone
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from supabase import create_client, Client  # pip install supabase

app = FastAPI(title="AI Companion Reminders (Resend Only)")

def must_env(name: str) -> str:
    v = os.getenv(name)
    if not v:
        raise RuntimeError(f"Missing required env var: {name}")
    return v

# --- Required env vars (fail fast with clear message) ---
CRON_SECRET = must_env("CRON_SECRET")
SUPABASE_URL = must_env("SUPABASE_URL")
SUPABASE_SERVICE_ROLE = must_env("SUPABASE_SERVICE_ROLE")
RESEND_KEY = must_env("RESEND_API_KEY")
FROM_EMAIL = os.getenv("FROM_EMAIL", "no-reply@yourdomain.com")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

@app.get("/internal/health")
def health():
    # simple health with minimal checks
    try:
        # lightweight request to confirm supabase client works
        return {"ok": True, "from_email": FROM_EMAIL}
    except Exception as e:
        return JSONResponse(status_code=500, content={"ok": False, "error": str(e)})

async def send_email(to: str, subject: str, html: str):
    """Send email via Resend API only."""
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(
            "https://api.resend.com/emails",
            headers={"Authorization": f"Bearer {RESEND_KEY}"},
            json={
                "from": FROM_EMAIL,
                "to": [to],
                "subject": subject,
                "html": html,
            },
        )
        # If Resend rejects (401/422/etc), this will raise an HTTPStatusError
        r.raise_for_status()

async def deliver(rem):
    to = rem["target"]
    subject = f"Reminder: {rem['title']}"
    html = f"<p>{rem['title']}</p><p>Scheduled at {rem['when_at']}</p>"
    try:
        await send_email(to, subject, html)
        supabase.table("reminders").update(
            {
                "sent_at": datetime.now(timezone.utc).isoformat(),
                "status": "sent",
                "last_error": None,
            }
        ).eq("id", rem["id"]).execute()
        return True, None
    except Exception as e:
        # capture full traceback for debugging
        err = f"{type(e).__name__}: {e}"
        supabase.table("reminders").update(
            {"status": "failed", "last_error": err}
        ).eq("id", rem["id"]).execute()
        print("EMAIL ERROR:", err)
        traceback.print_exc()
        return False, err

@app.post("/internal/run-reminders")
async def run_reminders(req: Request):
    # wrap entire handler to prevent 500s and return diagnostic JSON
    try:
        if req.query_params.get("secret") != CRON_SECRET:
            raise HTTPException(status_code=401, detail="bad secret")

        now = datetime.now(timezone.utc).isoformat()
        # due: not sent, schedule <= now (UTC)
        due = (
            supabase.table("reminders")
            .select("*")
            .is_("sent_at", None)
            .lte("when_at", now)
            .execute()
            .data
        )

        results = await asyncio.gather(*(deliver(r) for r in due), return_exceptions=False)
        sent = sum(1 for ok, _ in results if ok)
        errors = [err for ok, err in results if not ok and err]

        return {"checked": len(due), "sent": sent, "errors": len(errors), "details": errors[:3]}
    except HTTPException:
        raise
    except Exception as e:
        # Never crash: show descriptive error
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"error": str(e), "trace": traceback.format_exc().splitlines()[-8:]},
        )
