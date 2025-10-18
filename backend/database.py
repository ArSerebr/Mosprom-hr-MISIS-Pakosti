from tortoise import Tortoise

from auth import get_password_hash
from auth.models import User


async def init_db():
    await Tortoise.init(
        db_url='sqlite://db.sqlite3',
        modules={'models': ['auth.models', 'vacancies.models', 'internship.models', 'chats.models']}
    )
    await Tortoise.generate_schemas()

    if not await User.exists(role="hr"):
        await User.create(
            email="hr@company.com",
            password_hash=get_password_hash("password"),
            name="Иван Петров",
            role="hr"
        )