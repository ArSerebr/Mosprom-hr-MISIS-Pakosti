from fastapi import APIRouter, Depends, HTTPException

from auth.router import get_current_user
from auth.models import User
# from vacancies.models import Vacancy, Application
# from vacancies.schemas import (
#     Vacancy_Pydantic,
#     Application_Pydantic,
#     VacancyCreate,
#     VacancyUpdate,
#     ApplicationCreate,
# )

from internship.models import Internship, InternshipApplication
from internship.schemas import (
    Internship_Pydantic, 
    InternshipCreate, 
    InternshipUpdate, 
    InternshipApplication_Pydantic, 
    InternshipApplicationCreate, 
    ApplicationAndId
)


router = APIRouter(prefix="/internships", tags=["internships"])

@router.get("/read", response_model=list[Internship_Pydantic])
async def get_public_internships():
    return await Internship_Pydantic.from_queryset(Internship.filter(is_active=True))

@router.post("/create", response_model=Internship_Pydantic)
async def create_internship(
    internship_data: InternshipCreate,
    user: User = Depends(get_current_user)
):
    if user.role not in ["admin", "hr"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    internship = await Internship.create(
        title=internship_data.title,
        description=internship_data.description,
        university=internship_data.university,
        places=internship_data.places,
        start_date=internship_data.start_date,
        end_date=internship_data.end_date,
        created_by_id=user.id
    )
    return await Internship_Pydantic.from_tortoise_orm(internship)

@router.put("/{internship_id}", response_model=Internship_Pydantic)
async def update_internship(internship_id: int, internship_data: InternshipUpdate, user: User = Depends(get_current_user)):
    if user.role not in ["admin", "hr"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    internship = await Internship.get_or_none(id=internship_id)
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    if internship.created_by_id != user.id and user.role != "admin":
        raise HTTPException(status_code=403, detail="Can only edit your own internships")

    update_data = internship_data.dict(exclude_unset=True)
    await internship.update_from_dict(update_data)
    await internship.save()

    return await Internship_Pydantic.from_tortoise_orm(internship)


@router.get("/admin/applications", response_model=list[InternshipApplication_Pydantic])
async def get_all_internship_applications(user: User = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return await InternshipApplication_Pydantic.from_queryset(InternshipApplication.all().prefetch_related("internship"))


@router.post("/applications", response_model=Internship_Pydantic)
async def create_internship_application(application_data: InternshipApplicationCreate):
    internship = await Internship.get_or_none(id=application_data.vacancy_id, is_active=True)
    if not internship:
        raise HTTPException(status_code=404, detail="Vacancy not found or not active")

    internship_application = await InternshipApplication.create(
        internship=internship,
        applicant_name=application_data.applicant_name,
        applicant_email=application_data.applicant_email,
        applicant_university=application_data.applicant_university,
        message=application_data.message
    )
    return await InternshipApplication_Pydantic.from_tortoise_orm(internship_application)


@router.get("/internships/", response_model=list[Internship_Pydantic])
async def get_my_internships(user: User = Depends(get_current_user)):
    """
    get реквест, получает стажировки, созданные данным университетом
    """

    if user.role not in ["admin", "university"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    internships = Internship.filter(created_by=user.id)
    if not internships:
        raise HTTPException(status_code=404, detail="Vacancies not found")

    return await Internship_Pydantic.from_queryset(internships)


@router.get("/my_internships_applications", response_model=list[ApplicationAndId])
async def get_applications_for_my_internships(user: User = Depends(get_current_user)):
    """
    get реквест, получает все отклики на все вакансии, созданные данным пользователем
    """

    if user.role not in ["admin", "university"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    applications = await InternshipApplication.filter(internship__created_by=user.id).select_related("internship")
    return [ApplicationAndId(internship_id=app.internship.id, application=app) for app in applications]