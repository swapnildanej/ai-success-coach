import os
import asyncio
import httpx
from datetime import datetime, timezone
from fastapi import FastAPI, Request, HTTPException
from supabase import create_client, Client  # pip install supabase

app = FastAPI()

# Required environment variables
CRON_SECRET = os.environ["CRON_SECRET"]
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_ROLE = os.environ["SUPABASE_SERVICE_ROLE"]
RESEND_KEY = os.environ["RESEND_API_KEY"]  # enforce presence
FROM_EMAIL = os.getenv("FROM_EMAIL", "no-reply@yourdomain.com")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

async def send_email(to: str, subject: str, html: str):
    """Send email via Resend API only."""
    async with httpx.AsyncClient(timeout=20) as client:
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
        supabase.table("reminders").update(
            {"status": "failed", "last_error": str(e)}
        ).eq("id", rem["id"]).execute()
        return False, str(e)

@app.post("/internal/run-reminders")
async def run_reminders(req: Request):
    if req.query_params.get("secret") != CRON_SECRET:
        raise HTTPException(status_code=401, detail="bad secret")

    now = datetime.now(timezone.utc).isoformat()
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

    return {"checked": len(due), "sent": sent, "errors": len(errors)}
