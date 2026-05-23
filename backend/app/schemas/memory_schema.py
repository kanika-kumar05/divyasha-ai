from pydantic import BaseModel


class MemoryCreate(BaseModel):

    user_id: int

    title: str

    content: str

    category: str