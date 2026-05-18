from fastapi import APIRouter, Depends
from pydantic import BaseModel

from sqlalchemy.orm import Session

import requests

from app.database.database import SessionLocal
from app.models.chat_model import Chat

router = APIRouter()

class ChatRequest(BaseModel):
    user_id: int
    message: str

# Database dependency
def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()

@router.post("/chat")
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db)
):

    prompt = f"""
You are Asha AI, a caring AI companion for elderly people.

Your job:
- help with medicines
- help with memories
- provide emotional support
- speak calmly and simply

User message:
{request.message}
"""

    try:

        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3.2",
                "prompt": prompt,
                "stream": False
            }
        )

        data = response.json()

        ai_reply = data["response"]

        # Save chat to database
        new_chat = Chat(
            user_id=request.user_id,
            message=request.message,
            response=ai_reply
        )

        db.add(new_chat)

        db.commit()

        return {
            "reply": ai_reply
        }

    except Exception as e:

        print(e)

        return {
            "reply": "Sorry, I am having trouble thinking right now."
        }

@router.get("/chats/{user_id}")
def get_chats(
    user_id: int,
    db: Session = Depends(get_db)
):
    chats = db.query(Chat).filter(
        Chat.user_id == user_id
    ).all()

    return chats