from fastapi import APIRouter, Depends
from ..models.schema import Goal, GoalCreateRequest, GoalCreateResponse
from ..services.supabase_client import supabase_client
from ..utils.auth import verify_bearer

router = APIRouter(dependencies=[Depends(verify_bearer)])

@router.post("/create", response_model=GoalCreateResponse)
async def create_goal(body: GoalCreateRequest):
    # Example insert (sync call is fine in demo; consider async for prod libs)
    data = {"title": body.title, "category": body.category or "general"}
    res = supabase_client.table("goals").insert(data).execute()
    created = res.data[0] if res.data else data
    return GoalCreateResponse(goal=Goal(**created))
