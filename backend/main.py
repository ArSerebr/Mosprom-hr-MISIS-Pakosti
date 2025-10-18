from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tortoise import Tortoise
from auth.router import router as auth_router
from vacancies.router import router as vacancies_router
from internship.router import router as internship_router
from database import init_db


@asynccontextmanager
async def lifespan(app_instance):
    await init_db()
    yield
    await Tortoise.close_connections()


app = FastAPI(title="HR Application", lifespan=lifespan)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:7012", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение маршрутов с правильными префиксами
app.include_router(auth_router, prefix="/api/auth")
app.include_router(vacancies_router, prefix="/api/vacancies")
app.include_router(internship_router, prefix="/api")
