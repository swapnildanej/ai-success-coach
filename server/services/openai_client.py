import os, httpx

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

SYSTEM_COACH_PROMPT = """You are an AI Success Coach & Personal Growth Companion.
Tone: positive, practical, empathetic. Languages: English/Hindi/Marathi (mirror user).
Focus: motivation, goal-setting, productivity, confidence, consistency.
Keep replies concise with 1-2 actionable steps. Avoid therapy/medical claims."""

async def coach_reply(messages:list[dict], temperature:float=0.6):
    """
    messages = [{"role":"user","content":"I feel stuck in study."}, ...]
    """
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}"}
    payload = {
        "model": "gpt-4o-mini",
        "messages": [{"role":"system","content":SYSTEM_COACH_PROMPT}] + messages,
        "temperature": temperature
    }
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers)
        r.raise_for_status()
        data = r.json()
        return data["choices"][0]["message"]["content"]
