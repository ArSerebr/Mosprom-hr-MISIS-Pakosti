from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status
from pydantic import BaseModel, field_validator, EmailStr
from typing import Literal
import re

SECRET_KEY = "secret-key"  # заменить в продакшне
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# хеширование: по умолчанию PBKDF2-SHA256, также поддерживаем проверку старых bcrypt-хэшей
pwd_context = CryptContext(schemes=["pbkdf2_sha256", "bcrypt"], deprecated="auto")


 

# модели pydantic
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[int] = None

class UserInDB(BaseModel):
    id: int
    email: str
    role: str
    name: str

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None





class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: Literal["admin", "hr", "university"]

    @field_validator('password')
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError('Пароль должен быть минимум 8 знаков длиной')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Пароль должен иметь хотя бы 1 заглавную букву')
        if not re.search(r'[a-z]', v):
            raise ValueError('Пароль должен иметь хотя бы 1 букву')
        if not re.search(r'\d', v):
            raise ValueError('Пароль должен иметь хотя бы 1 цифру')
        return v

    @field_validator('name')
    def name_length(cls, v):
        if len(v) < 2:
            raise ValueError('Имя должно быть минимум 2 знаками длиной')
        if len(v) > 100:
            raise ValueError('Длина имени не должна быть больше 100 знаков')
        return v


class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    role: str

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str