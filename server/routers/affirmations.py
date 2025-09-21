from fastapi import APIRouter, Depends
from datetime import date
from utils.auth import get_current_user

router = APIRouter()

SAMPLE_LIST = [
  "I show up, even when it's hard.",
  "Small consistent steps create massive results.",
  "Focus. Finish. Flourish.",
]

@router.get("/today")
async def today_affirmation(user=Depends(get_current_user)):
    # MVP: static pick; later: generate via OpenAI & store in Supabase
    idx = (hash(user["uid"]) + hash(date.today())) % len(SAMPLE_LIST)
    return {"date": str(date.today()), "text": SAMPLE_LIST[idx]}
