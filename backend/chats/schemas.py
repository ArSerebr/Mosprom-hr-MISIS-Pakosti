# chats/schemas.py
from typing import Optional
from datetime import datetime
from chats.models import Chat, Message
from auth.models import User
from pydantic import BaseModel
from tortoise.contrib.pydantic import pydantic_model_creator

User_Pydantic = pydantic_model_creator(User, name="User", exclude=("password_hash",))

Chat_Pydantic = pydantic_model_creator(
    Chat,
    name="Chat",
    include=("id", "hr_user", "applicant_user", "vacancy", "vacancy_id", "created_at", "updated_at")
)

class MessageResponse(BaseModel):
    id: int
    chat_id: int
    sender_id: int
    sender_role: str
    sender_name: str
    content: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

Message_Pydantic = pydantic_model_creator(
    Message,
    name="Message",
    include=("id", "chat", "sender", "content", "is_read", "created_at")
)

MessageIn_Pydantic = pydantic_model_creator(Message, name="MessageIn", exclude_readonly=True)

class CreateChatRequest(BaseModel):
    applicant_user_id: int
    vacancy_id: int

class ChatResponse(BaseModel):
    id: int
    hr_user: User_Pydantic
    applicant_user: User_Pydantic
    vacancy_id: Optional[int]
    created_at: datetime
    updated_at: datetime