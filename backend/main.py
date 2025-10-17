from fastapi import FastAPI
from contextlib import asynccontextmanager
from auth.router import router as auth_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 🚀 при запуске
    print("🚀 Приложение запущено")
    yield
    # 🛑 при выключении
    print("🛑 Приложение остановлено")

app = FastAPI()
app.include_router(auth_router, prefix='/api/v1/auth')