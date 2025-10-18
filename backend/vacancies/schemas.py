from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel
from tortoise.contrib.pydantic import pydantic_model_creator

from vacancies.models import Vacancy, Application


Vacancy_Pydantic = pydantic_model_creator(Vacancy, name="Vacancy")
Application_Pydantic = pydantic_model_creator(Application, name="Application", include=("id", "created_by.id", "applicant_name", "applicant_email", "applicant_university", "message", "status", "created_at"))

VacancyCreate_Pydantic = pydantic_model_creator(Vacancy, name="VacancyCreate", exclude_readonly=True)
ApplicationCreate_Pydantic = pydantic_model_creator(Application, name="ApplicationCreate", exclude_readonly=True)

class ApplicationWithApplicantId(BaseModel):
    id: int
    applicant_user_id: Optional[int]  # This will be the ID of the applicant
    applicant_name: str
    applicant_email: str
    applicant_university: str
    message: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class ApplicationAndId(BaseModel):
    vacancy_id: int
    application: ApplicationWithApplicantId

class VacancyCreate(BaseModel):
    vacancy_title: str
    company_logo: Optional[str] = None
    company_name: str
    platform: str
    specialty: str
    responsibilities: List[str]
    requirements: List[str]
    employment_type: Optional[str] = None
    schedule: Optional[str] = None
    location: Optional[str] = None
    location_yandex_link: Optional[str] = None
    probation: Optional[str] = None
    salary: Optional[str] = None
    extra_info: Optional[str] = None
    link_text: Optional[str] = None
    company_website: Optional[str] = None
    promo_video: Optional[str] = None
    status: str = "pending"

    class Config:
        json_schema_extra = {
            "example": {
                "vacancy_title": "Backend Developer",
                "company_logo": "https://example.com/logo.png",
                "company_name": "Tech Company Inc.",
                "platform": "hh.ru",
                "specialty": "Backend Development",
                "responsibilities": [
                    "Разработка API для веб-приложений",
                    "Оптимизация производительности базы данных",
                    "Интеграция с внешними сервисами"
                ],
                "requirements": [
                    "Опыт работы с Python/FastAPI",
                    "Знание PostgreSQL",
                    "Опыт работы с Docker"
                ],
                "employment_type": "Официальное",
                "schedule": "Полный день",
                "location": "Москва, офис",
                "location_yandex_link": "https://yandex.ru/maps/...",
                "probation": "3 месяца",
                "salary": "150,000 - 200,000 RUB",
                "extra_info": "Дополнительная информация о вакансии",
                "link_text": "Подать заявку",
                "company_website": "https://company.com",
                "promo_video": "https://youtube.com/watch?v=...",
                "status": "pending"
            }
        }


class VacancyUpdate(BaseModel):
    vacancy_title: Optional[str] = None
    company_logo: Optional[str] = None
    company_name: Optional[str] = None
    platform: Optional[str] = None
    specialty: Optional[str] = None
    responsibilities: Optional[List[str]] = None
    requirements: Optional[List[str]] = None
    employment_type: Optional[str] = None
    schedule: Optional[str] = None
    location: Optional[str] = None
    location_yandex_link: Optional[str] = None
    probation: Optional[str] = None
    salary: Optional[str] = None
    extra_info: Optional[str] = None
    link_text: Optional[str] = None
    company_website: Optional[str] = None
    promo_video: Optional[str] = None
    status: Optional[str] = None
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

    
