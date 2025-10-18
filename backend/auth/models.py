from typing import Optional

from pydantic import BaseModel
from tortoise import fields, models
from tortoise.contrib.pydantic import pydantic_model_creator


class User(models.Model):
    id = fields.IntField(pk=True)
    email = fields.CharField(max_length=255, unique=True)
    password_hash = fields.CharField(max_length=255)
    role = fields.CharField(max_length=20)  # admin, hr, university
    name = fields.CharField(max_length=100)
    created_at = fields.DatetimeField(auto_now_add=True)

    async def verify_password(self, password: str):
        from auth import verify_password  
        return verify_password(password, self.password_hash)

    class PydanticMeta:
        exclude = ["password_hash"]

User_Pydantic = pydantic_model_creator(User, name="User")
UserIn_Pydantic = pydantic_model_creator(User, name="UserIn", exclude_readonly=True)