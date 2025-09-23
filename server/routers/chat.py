from fastapi import APIRouter, Depends, HTTPException
from ..models.schema import ChatRequest, ChatResponse
from ..services.openai_client import get_chat_completion
from ..utils.auth import get_current_user

# Protect all routes in this router with auth
router = APIRouter(dependencies=[Depends(get_current_user)])

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(body: ChatRequest):
    """Generate a coach reply using OpenAI based on full message history.
    Expects body.messages = [{"role": "user"|"assistant"|"system", "content": "..."}, ...]
    Returns ChatResponse(content=str).
    """
    try:
        reply = await get_chat_completion(body.messages)
        return ChatResponse(content=reply)
    except Exception as e:
        # Log/print can be added here if you have a logger
        raise HTTPException(status_code=500, detail="Chat generation failed") from e
