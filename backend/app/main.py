from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import engine
from app.database.database import Base

from app.models.user_model import User

from app.routes.auth_routes import router as auth_router
from app.routes.chat_routes import router as chat_router
from app.models.chat_model import Chat

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(chat_router)

@app.get("/")
def home():
    return {
        "message": "Asha AI Backend Running"
    }