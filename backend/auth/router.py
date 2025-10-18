from datetime import timedelta
from fastapi import Depends, HTTPException, status, APIRouter
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from auth import (
    verify_token, Token, UserResponse, UserRegister,
    get_password_hash, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
)
from auth.auth import LoginRequest

from auth.models import User

security = HTTPBearer()

router = APIRouter(tags=['auth'])

@router.get("/me")
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id: int = payload.get("user_id")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    user = await User.get_or_none(id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserRegister):
    """
    регистрация пользователя

    - **email**: почта (должна быть уникальной)
    - **password**: пароль, минимум 8 знаков, с цифрой и заглавной буквой
    - **name**: длины от 2 до 100
    - **role**: admin, hr, или university (определяет спектр возможностей)
    """

    existing_user = await User.get_or_none(email=user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # if user_data.role == "admin":
    #     admin_count = await User.filter(role="admin").count()
    #     if admin_count > 0:
    #         raise HTTPException(
    #             status_code=status.HTTP_400_BAD_REQUEST,
    #             detail="Admin user already exists"
    #         )

    try:
        user = await User.create(
            email=user_data.email,
            password_hash=get_password_hash(user_data.password),
            name=user_data.name,
            role=user_data.role
        )

        return UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            role=user.role
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )

@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest):
    """
    логин
    возвращает json с jwt токеном
    - **email**: почта
    - **password**: пароль
    """
    user = await User.get_or_none(email=login_data.email)
    if not user or not await user.verify_password(login_data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"user_id": user.id, "email": user.email, "role": user.role},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}