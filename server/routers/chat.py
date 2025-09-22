from fastapi import APIRouter, Depends
from pydantic import BaseModel
from ..utils.auth import get_current_user
# from ..services.openai_client import coach_reply  # real mode साठी

router = APIRouter()

class ChatIn(BaseModel):
    messages: list[dict]   # [{role:"user"/"assistant", content:"..."}]

@router.post("/")
async def chat_endpoint():
    # real mode:
    # async def chat_endpoint(inb: ChatIn, user=Depends(get_current_user)):
    #     reply = await coach_reply(inb.messages)
    #     return {"content": reply}
    return {"msg": "chat working (no AI call yet)"}  # safe mode
