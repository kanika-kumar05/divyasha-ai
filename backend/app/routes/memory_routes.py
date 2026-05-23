from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import SessionLocal

from app.models.memory_model import Memory

from app.schemas.memory_schema import MemoryCreate

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.post("/memories")
def create_memory(
    memory: MemoryCreate,
    db: Session = Depends(get_db)
):

    new_memory = Memory(
        user_id=memory.user_id,
        title=memory.title,
        content=memory.content,
        category=memory.category
    )

    db.add(new_memory)

    db.commit()

    db.refresh(new_memory)

    return {
        "message": "Memory saved successfully",
        "memory": new_memory
    }


@router.get("/memories/{user_id}")
def get_memories(
    user_id: int,
    db: Session = Depends(get_db)
):

    memories = db.query(Memory).filter(
        Memory.user_id == user_id
    ).all()

    return memories