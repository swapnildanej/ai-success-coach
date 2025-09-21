from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List
from utils.auth import get_current_user

router = APIRouter()
_db = {}  # {uid: [{"id":"1","title":"Study 2h","category":"study"}]}

class Goal(BaseModel):
    id: str
    title: str
    category: str = "habit"
    is_active: bool = True

class GoalCreate(BaseModel):
    title: str
    category: str = "habit"

@router.get("", response_model=List[Goal])
async def list_goals(user=Depends(get_current_user)):
    return _db.get(user["uid"], [])

@router.post("", response_model=Goal)
async def create_goal(body: GoalCreate, user=Depends(get_current_user)):
    goals = _db.setdefault(user["uid"], [])
    gid = f"g_{len(goals)+1}"
    g = Goal(id=gid, title=body.title, category=body.category)
    goals.append(g.model_dump())
    return g

@router.delete("/{goal_id}")
async def delete_goal(goal_id: str, user=Depends(get_current_user)):
    goals = _db.get(user["uid"], [])
    before = len(goals)
    _db[user["uid"]] = [g for g in goals if g["id"] != goal_id]
    if len(_db[user["uid"]]) == before:
        raise HTTPException(404, "Not found")
    return {"ok": True}
