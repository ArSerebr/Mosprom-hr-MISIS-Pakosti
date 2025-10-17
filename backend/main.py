from contextlib import asynccontextmanager
from fastapi import FastAPI
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
app.include_router(auth_router, prefix="/auth")
app.include_router(vacancies_router, prefix="")
app.include_router(internship_router, prefix="")
