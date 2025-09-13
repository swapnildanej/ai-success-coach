from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="AI Success Coach API")

origins = [o.strip() for o in os.getenv("ALLOW_ORIGINS", "*").split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routers import chat, affirmations, goals
app.include_routers(chat.routers, prefix="/chat", tags=["chat"])
app.include_routers(affirmations.routers, prefix="/affirmations", tags=["affirmations"])
app.include_routers(goals.routers, prefix="/goals", tags=["goals"])

@app.get("/health")
def health():
    return {"ok": True}
