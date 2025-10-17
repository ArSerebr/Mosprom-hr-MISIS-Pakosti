from tortoise import fields, models


class Internship(models.Model):
    id = fields.IntField(pk=True)
    title = fields.CharField(max_length=200)
    description = fields.TextField()
    university = fields.CharField(max_length=100)
    # type = fields.CharField(max_length=20)  # vacancy or internship
    is_active = fields.BooleanField(default=True)
    places = fields.IntField()
    start_date = fields.DatetimeField()
    end_date = fields.DatetimeField()
    created_by = fields.ForeignKeyField("models.User", related_name="internships")
    created_at = fields.DatetimeField(auto_now_add=True)

class InternshipApplication(models.Model):
    id = fields.IntField(pk=True)
    internship = fields.ForeignKeyField("models.Internship", related_name="InternshipApplications")
    applicant_name = fields.CharField(max_length=100)
    applicant_email = fields.CharField(max_length=255)
    applicant_company = fields.CharField(max_length=100)
    message = fields.TextField(null=True)
    places = fields.IntField()
    status = fields.CharField(max_length=20, default="pending")
    created_at = fields.DatetimeField(auto_now_add=True)