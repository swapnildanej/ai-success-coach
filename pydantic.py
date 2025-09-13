from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, Any]]] = None

class ChatResponse(BaseModel):
    reply: str

class AffirmationRequest(BaseModel):
    goals: List[str] = Field(default_factory=list)
    count: int = 5

class AffirmationResponse(BaseModel):
    affirmations: List[str]

class Goal(BaseModel):
    id: int | None = None
    title: str
    category: str | None = None

class GoalCreateRequest(BaseModel):
    title: str
    category: str | None = None

class GoalCreateResponse(BaseModel):
    goal: Goal
