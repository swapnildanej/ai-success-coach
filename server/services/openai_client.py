import os
from typing import List, Dict
import httpx

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


SYSTEM_COACH_PROMPT = (
    "You are an AI Success Coach & Personal Growth Companion.\n"
    "Tone: positive, practical, empathetic. Languages: English/Hindi/Marathi (mirror user).\n"
    "Focus: motivation, goal-setting, productivity, confidence, consistency.\n"
    "Keep replies concise with 1-2 actionable steps. Avoid therapy/medical claims."
)


async def get_chat_completion(messages: List[Dict], *, temperature: float = 0.6) -> str:
    """Call OpenAI Chat Completions and return assistant text.
    `messages` must be a list of {role, content} dicts.
    """
    if not OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY is not set in environment.")

    # Ensure system prompt is at the front
    msgs = messages or []
    if not msgs or msgs[0].get("role") != "system":
        msgs = [{"role": "system", "content": SYSTEM_COACH_PROMPT}] + msgs

    payload = {
        "model": "gpt-4o-mini",
        "messages": msgs,
        "temperature": temperature,
    }

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers)
        resp.raise_for_status()
        data = resp.json()

    # Defensive parsing
    try:
        return data["choices"][0]["message"]["content"]
    except Exception as exc:
        raise RuntimeError(f"OpenAI response parsing failed: {data}") from exc
