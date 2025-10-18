from tortoise import fields, models


class Chat(models.Model):
    id = fields.IntField(pk=True)
    hr_user = fields.ForeignKeyField("models.User", related_name="hr_chats")
    applicant_user = fields.ForeignKeyField("models.User", related_name="applicant_chats")
    vacancy = fields.ForeignKeyField("models.Vacancy", related_name="chats", null=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "chats"
        unique_together = (("hr_user", "applicant_user", "vacancy"),)

class Message(models.Model):
    id = fields.IntField(pk=True)
    chat = fields.ForeignKeyField("models.Chat", related_name="messages")
    sender = fields.ForeignKeyField("models.User", related_name="sent_messages")
    content = fields.TextField()
    is_read = fields.BooleanField(default=False)
    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "messages"

