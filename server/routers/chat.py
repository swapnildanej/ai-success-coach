from fastapi import APIRouter, Depends
from pydantic import BaseModel
from ..utils.auth import get_current_user
from ..services.openai_client import coach_reply  # तुमचा वास्तविक फंक्शन

router = APIRouter()

class ChatIn(BaseModel):
    messages: list[dict]

@router.post("/")
async def chat_endpoint(inb: ChatIn):   # user=Depends(get_current_user) काढा
    reply = await coach_reply(inb.messages)
    return {"content": reply}
