from typing import Optional

from pydantic import BaseModel
from tortoise.contrib.pydantic import pydantic_model_creator

from vacancies.models import Vacancy, Application


Vacancy_Pydantic = pydantic_model_creator(Vacancy, name="Vacancy")
Application_Pydantic = pydantic_model_creator(Application, name="Application")

VacancyCreate_Pydantic = pydantic_model_creator(Vacancy, name="VacancyCreate", exclude_readonly=True)
ApplicationCreate_Pydantic = pydantic_model_creator(Application, name="ApplicationCreate", exclude_readonly=True)


class VacancyCreate(BaseModel):
    title: str
    description: str
    company: str = "Unknown"
    type: str = "vacancy"

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Backend Developer",
                "description": "We are looking for a skilled backend developer...",
                "company": "Tech Company Inc.",
                "type": "vacancy"
            }
        }


class VacancyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    company: Optional[str] = None
    type: Optional[str] = None
    is_active: Optional[bool] = None


class ApplicationCreate(BaseModel):
    vacancy_id: int
    applicant_name: str
    applicant_email: str
    applicant_university: str
    message: str = ""

    class Config:
        json_schema_extra = {
            "example": {
                "vacancy_id": 1,
                "applicant_name": "John Doe",
                "applicant_email": "john@university.edu",
                "applicant_university": "State University",
                "message": "I'm very interested in this position!"
            }
        }


