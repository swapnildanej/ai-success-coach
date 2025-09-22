from fastapi import APIRouter, Depends
from models.pydantic import AffirmationRequest, AffirmationResponse
from ..utils.auth import verify_bearer

router = APIRouter(dependencies=[Depends(verify_bearer)])

@router.post("/", response_model=AffirmationResponse)
async def make_affirmations(body: AffirmationRequest):
    items = [f"I am committed to {goal}." for goal in body.goals]
    return AffirmationResponse(affirmations=items[: body.count])
