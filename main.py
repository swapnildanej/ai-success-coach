import io, os, time, hashlib, hmac, json
from datetime import datetime, timezone
from typing import List, Optional
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from openai import OpenAI
from supabase import create_client, Client
import requests

load_dotenv()
OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]
client = OpenAI(api_key=OPENAI_API_KEY)

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_ROLE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
sb: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

RESEND_API_KEY = os.getenv("RESEND_API_KEY")
TG_BOT = os.getenv("TELEGRAM_BOT_TOKEN")
CRON_SECRET = os.environ["CRON_SECRET"]

app = FastAPI(title="AI Companion MVP")
@app.get("/")
def root():
    return {"message": "AI Companion backend is running 🚀"}

@app.get("/healthz")
def health():
    return {"status": "ok"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SYSTEM_PROMPT = (
    "You are 'Aaroh', a warm, concise AI companion & life coach for India. "
    "Be supportive, practical, and non-judgmental. Use simple English; sprinkle Hindi/Marathi phrases if detected. "
    "Focus on goal-setting, mood support, productivity, relationships, and reminders. Keep answers crisp."
)

# ---------- Chat ----------
@app.post("/api/chat")
async def chat(messages: List[dict]):
    """
    messages = [{role:'user'|'assistant'|'system', content:'...'}]
    Frontend already stores chat history; we just return model reply.
    """
    try:
        out = client.chat.completions.create(
            model="gpt-5",
            messages=[{"role": "system", "content": SYSTEM_PROMPT}] + messages[-15:],
        )
        reply = out.choices[0].message.content
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(500, str(e))

# ---------- Speech-to-Text ----------
@app.post("/api/transcribe")
async def transcribe(file: UploadFile = File(...)):
    try:
        audio_bytes = await file.read()
        out = client.audio.transcriptions.create(
            model="gpt-4o-transcribe",  # Whisper-based
            file=("audio.webm", audio_bytes),
        )
        return {"text": out.text}
    except Exception as e:
        raise HTTPException(500, str(e))

# ---------- Text-to-Speech ----------
@app.post("/api/tts")
async def tts(text: str = Form(...), voice: str = Form("alloy")):
    try:
        speech = client.audio.speech.create(
            model="gpt-4o-mini-tts",
            voice=voice,
            input=text,
            format="mp3",
        )
        return StreamingResponse(io.BytesIO(speech.read()), media_type="audio/mpeg")
    except Exception as e:
        raise HTTPException(500, str(e))

# ---------- Reminder Worker ----------
def send_email(to: str, subject: str, html: str) -> bool:
    if not RESEND_API_KEY:
        return False
    r = requests.post(
        "https://api.resend.com/emails",
        headers={"Authorization": f"Bearer {RESEND_API_KEY}", "Content-Type": "application/json"},
        json={"from": "Aaroh <noreply@yourapp.in>", "to": [to], "subject": subject, "html": html},
        timeout=15,
    )
    return r.status_code in (200, 201)

def send_telegram(chat_id: str, text: str) -> bool:
    if not TG_BOT:
        return False
    url = f"https://api.telegram.org/bot{TG_BOT}/sendMessage"
    r = requests.post(url, json={"chat_id": chat_id, "text": text}, timeout=15)
    return r.ok

@app.post("/internal/run-reminders")
async def run_reminders(request: Request):
    # simple shared-secret
    if request.query_params.get("secret") != CRON_SECRET:
        raise HTTPException(401, "unauthorized")

    now = datetime.now(timezone.utc)
    # fetch due reminders
    due = sb.table("reminders").select("*").eq("status", "pending").lte("due_at", now.isoformat()).execute().data
    sent_count = 0

    for r in due:
        ok = False
        try:
            if r["channel"] == "email":
                target = r["target"]
                if not target:
                    # fallback to profile email if empty
                    prof = sb.table("profiles").select("id").eq("id", r["user_id"]).execute()
                    target = None
                ok = send_email(target or "", "⏰ Reminder", f"<p>{r['title']}</p>")
            elif r["channel"] == "telegram":
                ok = send_telegram(r.get("target"), f"⏰ Reminder: {r['title']}")
        except Exception:
            ok = False

        status = "sent" if ok else "failed"
        sb.table("reminders").update({"status": status, "attempts": r["attempts"] + 1}).eq("id", r["id"]).execute()
        if ok: sent_count += 1

    return {"checked": len(due), "sent": sent_count}
