from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException, status
from datetime import datetime
import json
from typing import List
from .connection_manager import manager
from .dependencies import get_websocket_user, get_chat_for_user
from .models import Chat, Message
from auth.models import User
from auth.router import get_current_user
from vacancies.models import Vacancy
from .schemas import Message_Pydantic, Chat_Pydantic, CreateChatRequest, ChatResponse, MessageResponse

router = APIRouter(prefix="/chats", tags=["chats"])


@router.post("", response_model=Chat_Pydantic)
async def create_chat(
        request: CreateChatRequest,
        current_user: User = Depends(get_current_user)
):
    """
    Создает чат между текущим пользователем (HR) и соискателем для конкретной вакансии
    """
    if current_user.role not in ["hr", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only HR or ADMIN users can create chats"
        )

    applicant = await User.get_or_none(id=request.applicant_user_id)
    if not applicant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Applicant user not found"
        )

    vacancy = await Vacancy.get_or_none(id=request.vacancy_id).prefetch_related("created_by")
    if not vacancy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vacancy not found"
        )

    if vacancy.created_by is None or vacancy.created_by.id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only create chats for your own vacancies"
        )

    existing_chat = await Chat.get_or_none(
        hr_user=current_user,
        applicant_user=applicant,
        vacancy=vacancy
    ).prefetch_related("hr_user", "applicant_user", "vacancy")

    if existing_chat:
        return await Chat_Pydantic.from_tortoise_orm(existing_chat)

    chat = await Chat.create(
        hr_user=current_user,
        applicant_user=applicant,
        vacancy=vacancy
    )

    chat_with_relations = await Chat.get(id=chat.id).prefetch_related("hr_user", "applicant_user", "vacancy")

    return await Chat_Pydantic.from_tortoise_orm(chat_with_relations)


@router.get("", response_model=List[Chat_Pydantic])
async def get_user_chats(current_user: User = Depends(get_current_user)):
    hr_chats = await Chat.filter(hr_user=current_user).prefetch_related("hr_user", "applicant_user", "vacancy")
    applicant_chats = await Chat.filter(applicant_user=current_user).prefetch_related("hr_user", "applicant_user",
                                                                                      "vacancy")

    all_chats = list(hr_chats) + list(applicant_chats)

    return [await Chat_Pydantic.from_tortoise_orm(chat) for chat in all_chats]


@router.get("/{chat_id}/messages", response_model=List[MessageResponse])
async def get_chat_messages(
        chat_id: int,
        current_user: User = Depends(get_current_user),
):
    chat = await get_chat_for_user(chat_id, current_user)

    messages = await Message.filter(chat=chat).prefetch_related("sender", "chat").order_by("created_at")

    message_responses = []
    for message in messages:
        sender_role = "hr" if message.sender_id == chat.hr_user_id else "applicant"

        sender_name = message.sender.name
        if not sender_name:
            sender_name = message.sender.email

        message_responses.append(MessageResponse(
            id=message.id,
            chat_id=message.chat_id,
            sender_id=message.sender_id,
            sender_role=sender_role,
            sender_name=sender_name,
            content=message.content,
            is_read=message.is_read,
            created_at=message.created_at
        ))

    return message_responses


@router.post("/{chat_id}/messages")
async def create_message(
        chat_id: int,
        content: str,
        current_user: User = Depends(get_current_user),
):
    chat = await get_chat_for_user(chat_id, current_user)

    if not content or not content.strip():
        raise HTTPException(status_code=400, detail="Message content cannot be empty")

    message = await Message.create(
        chat=chat,
        sender=current_user,
        content=content.strip()
    )

    await Chat.filter(id=chat_id).update(updated_at=datetime.now())

    return await Message_Pydantic.from_tortoise_orm(message)