from tortoise import fields, models


class Vacancy(models.Model):
    id = fields.IntField(pk=True)
    vacancy_title = fields.CharField(max_length=200)
    company_logo = fields.CharField(max_length=500, null=True)
    company_name = fields.CharField(max_length=100)
    platform = fields.CharField(max_length=100)
    specialty = fields.CharField(max_length=100)
    responsibilities = fields.JSONField()  # List[str]
    requirements = fields.JSONField()  # List[str]
    employment_type = fields.CharField(max_length=50, null=True)
    schedule = fields.CharField(max_length=100, null=True)
    location = fields.CharField(max_length=200, null=True)
    location_yandex_link = fields.CharField(max_length=500, null=True)
    probation = fields.CharField(max_length=100, null=True)
    salary = fields.CharField(max_length=100, null=True)
    extra_info = fields.TextField(null=True)
    link_text = fields.TextField(null=True)
    company_website = fields.CharField(max_length=500, null=True)
    promo_video = fields.CharField(max_length=500, null=True)
    status = fields.CharField(max_length=20, default="pending")  # approve/pending/rejected
    is_active = fields.BooleanField(default=True)
    created_by = fields.ForeignKeyField("models.User", related_name="vacancies")
    created_at = fields.DatetimeField(auto_now_add=True)


class Application(models.Model):
    id = fields.IntField(pk=True)
    vacancy = fields.ForeignKeyField("models.Vacancy", related_name="applications")
    applicant_name = fields.CharField(max_length=100)
    applicant_email = fields.CharField(max_length=255)
    applicant_university = fields.CharField(max_length=100)
    message = fields.TextField(null=True)
    status = fields.CharField(max_length=20, default="pending")
    created_at = fields.DatetimeField(auto_now_add=True)




