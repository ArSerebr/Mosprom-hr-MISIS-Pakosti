from fastapi import WebSocket, HTTPException, status, Depends
from datetime import datetime
from typing import Optional
from auth.auth import verify_token, SECRET_KEY, ALGORITHM
from auth.models import User
from chats.models import Chat
from auth.router import get_current_user
from jose import JWTError, jwt


async def get_websocket_user(websocket: WebSocket) -> Optional[User]:
    try:
        token = websocket.query_params.get("token")
        if not token:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return None

        payload = verify_token(token)
        if payload is None:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return None

        email: str = payload.get("sub")
        user_id: int = payload.get("user_id")

        if email is None and user_id is None:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return None

        if user_id:
            user = await User.get_or_none(id=user_id)
        else:
            user = await User.get_or_none(email=email)

        if user is None:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return None

        return user

    except JWTError:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return None
    except Exception as e:
        print(f"WebSocket auth error: {e}")
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return None


async def get_chat_for_user(chat_id: int, current_user: User) -> Chat:
    chat = await Chat.get_or_none(id=chat_id).prefetch_related("hr_user", "applicant_user", "vacancy")
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    if current_user.id not in [chat.hr_user_id, chat.applicant_user_id]:
        raise HTTPException(status_code=403, detail="Access denied")

    return chat