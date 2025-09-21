from fastapi import APIRouter, Depends
from pydantic import BaseModel
from utils.auth import get_current_user
from services.openai_client import coach_reply

router = APIRouter()

class ChatIn(BaseModel):
    messages: list[dict]   # [{role:"user"/"assistant", content:"..."}]

@router.post("")
async def chat(inb: ChatIn, user=Depends(get_current_user)):
    # TODO: enforce usage limits for free tier here
    content = await coach_reply(inb.messages)
    return {"reply": content}
