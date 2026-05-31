from fastapi import APIRouter, Depends
from pydantic import BaseModel

from sqlalchemy.orm import Session

import requests

from app.database.database import SessionLocal
from app.models.chat_model import Chat
from app.models.memory_model import Memory
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


def load_user_memories_to_faiss(user_id: int, db: Session):
    chats = db.query(Chat).filter(
        Chat.user_id == user_id
    ).all()

    for chat in chats:
        if chat.message:
            add_memory(
                chat.id,
                chat.message
            )

    saved_memories = db.query(Memory).filter(
        Memory.user_id == user_id
    ).all()

    for memory in saved_memories:
        if memory.content:
            add_memory(
                memory.id,
                memory.content
            )


def detect_emotion(message: str):

    text = message.lower()

    if any(word in text for word in ["sad", "lonely", "alone", "cry", "upset"]):
        return "sad"

    if any(word in text for word in ["scared", "afraid", "fear", "panic", "worried"]):
        return "fear"

    if any(word in text for word in ["happy", "good", "excited", "joy", "great"]):
        return "happy"

    if any(word in text for word in ["angry", "irritated", "mad", "annoyed"]):
        return "angry"

    if any(word in text for word in ["confused", "forgot", "forget", "lost"]):
        return "confused"

    return "neutral"


@router.post("/chat")
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db)
):

    load_user_memories_to_faiss(
        request.user_id,
        db
    )

    memories = search_memory(
        request.message,
        top_k=3
    )

    past_chats = db.query(Chat).filter(
        Chat.user_id == request.user_id
    ).order_by(Chat.id.desc()).limit(20).all()

    chat_context = "\n".join(
        [chat.message for chat in past_chats if chat.message]
    )

    detected_emotion = detect_emotion(
        request.message
    )

    memory_context = ""

    if memories:
        memory_context = "\n".join(
            [memory["text"] for memory in memories]
        )

    prompt = f"""
You are Divyasha, a caring AI memory companion for elderly people.

Rules:
- Answer ONLY the user's current question.
- Use past memories only if they are directly related to the user's current message.
- If past data is unrelated, ignore it completely.
- If the user asks about something they told you earlier, check the saved memory and recent database chat history.
- Do not randomly mention names, school, medicine, family, or old details unless asked.
- Keep the answer short, maximum 3 to 4 lines.
- Do not invent details.
- If you still cannot find the answer in the context, say: "I don't remember that clearly."
- Speak warmly and simply.

Detected user emotion:
{detected_emotion}

Relevant semantic memories:
{memory_context}

Recent database chat history:
{chat_context}

Current user message:
{request.message}

Answer:
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

        ai_reply = data.get("response")

        if not ai_reply:
            return {
                "reply": "Ollama did not return a valid response. Please check if the model is running.",
                "emotion": detected_emotion,
                "used_memories": memories
            }

        new_chat = Chat(
            user_id=request.user_id,
            message=request.message,
            response=ai_reply,
            emotion=detected_emotion
        )

        db.add(new_chat)
        db.commit()
        db.refresh(new_chat)

        add_memory(
            new_chat.id,
            request.message
        )

        return {
            "reply": ai_reply,
            "emotion": detected_emotion,
            "used_memories": memories
        }

    except Exception as e:
        print(e)

        return {
            "reply": "Sorry, I am having trouble thinking right now.",
            "emotion": detected_emotion,
            "used_memories": []
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