import os
import httpx

FCM_SERVER_KEY = os.getenv("FCM_SERVER_KEY")
FCM_URL = "https://fcm.googleapis.com/fcm/send"

async def send_fcm_notification(token: str, title: str, body: str, data: dict | None = None):
    if not FCM_SERVER_KEY:
        return {"skipped": True, "reason": "FCM_SERVER_KEY not set"}

    headers = {
        "Authorization": f"key={FCM_SERVER_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "to": token,
        "notification": {"title": title, "body": body},
        "data": data or {}
    }
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(FCM_URL, headers=headers, json=payload)
        r.raise_for_status()
        return r.json()
