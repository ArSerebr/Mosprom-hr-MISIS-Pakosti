from typing import Optional
from datetime import datetime

from pydantic import BaseModel
from tortoise.contrib.pydantic import pydantic_model_creator

from internship.models import Internship, InternshipApplication



Internship_Pydantic = pydantic_model_creator(Internship, name="Internship")
InternshipApplication_Pydantic = pydantic_model_creator(InternshipApplication, name="InternshipApplication")

IntrenshipCreate_Pydantic = pydantic_model_creator(Internship, name="InternshipCreate", exclude_readonly=True)
InternshipApplicationCreate_Pydantic = pydantic_model_creator(InternshipApplication, name="InternshipApplicationCreate", exclude_readonly=True)


class ApplicationAndId(BaseModel):
    vacancy_id: int
    application: InternshipApplication_Pydantic

class InternshipCreate(BaseModel):
    title: str
    description: str
    university: str = "Unknown"
    type: str = "internship"
    places: int 
    start_date: datetime
    end_date: datetime
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "Backend Developer",
                "description": "We are looking for a skilled backend developer...",
                "university": "Tech University",
                "type": "internship",
                "places": 3,
                "start_date": "2025-11-01T09:00:00",
                "end_date": "2026-02-01T18:00:00"
            }
        }


class InternshipUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    company: Optional[str] = None
    type: Optional[str] = None
    is_active: Optional[bool] = None


class InternshipApplicationCreate(BaseModel):
    vacancy_id: int
    applicant_name: str
    applicant_email: str
    applicant_company: str
    message: str = ""
    places: int

    class Config:
        json_schema_extra = {
            "example": {
                "vacancy_id": 1,
                "applicant_name": "John Doe",
                "applicant_email": "john@company.com",
                "applicant_company": "Tech Company Inc.",
                "message": "I'm very interested in this internship!",
                "places": 1
            }
        }
