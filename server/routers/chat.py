from fastapi import APIRouter, Depends
from ..models.schema import ChatRequest, ChatResponse
from ..services.openai_client import get_chat_completion
from ..utils.auth import get_current_user

router = APIRouter(dependencies=[Depends(get_current_user)])

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(body: ChatRequest):
    reply = await coach_reply(body.message, body.history or [])
    return ChatResponse(reply=reply)
