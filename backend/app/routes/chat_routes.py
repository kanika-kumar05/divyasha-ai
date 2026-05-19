from fastapi import APIRouter, Depends
from pydantic import BaseModel

from sqlalchemy.orm import Session

import requests

from app.database.database import SessionLocal
from app.models.chat_model import Chat
from app.utils.embedding_utils import add_memory, search_memory

router = APIRouter()


class ChatRequest(BaseModel):
    user_id: int
    message: str


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

    # Search relevant past memories
    memories = search_memory(request.message)

    memory_context = ""

    if memories:
        memory_context = "\n".join(
            [memory["text"] for memory in memories]
        )

    prompt = f"""
You are Asha AI, a caring AI companion for elderly people.

Your job:
- help with medicines
- help with memories
- provide emotional support
- speak calmly and simply
- use past memories only if they are relevant

Relevant past memories:
{memory_context}

User message:
{request.message}

Reply in a helpful and caring way.
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

        new_chat = Chat(
            user_id=request.user_id,
            message=request.message,
            response=ai_reply
        )

        db.add(new_chat)
        db.commit()
        db.refresh(new_chat)

        # Store new message into semantic memory
        add_memory(
            new_chat.id,
            request.message
        )

        return {
            "reply": ai_reply,
            "used_memories": memories
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


@router.delete("/chats/{user_id}")
def delete_chats(
    user_id: int,
    db: Session = Depends(get_db)
):
    db.query(Chat).filter(
        Chat.user_id == user_id
    ).delete()

    db.commit()

    return {
        "message": "Chats deleted successfully"
    }


@router.post("/memory-search")
def memory_search(data: dict):

    query = data["query"]

    results = search_memory(query)

    return {
        "results": results
    }