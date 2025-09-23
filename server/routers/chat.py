from fastapi import APIRouter, Depends
from ..models.schema import ChatRequest, ChatResponse
from ..services.openai_client import coach_reply
from ..utils.auth import verify_bearer

router = APIRouter(dependencies=[Depends(verify_bearer)])

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(body: ChatRequest):
    reply = await get_chat_completion(body.message, body.history or [])
    return ChatResponse(reply=reply)
