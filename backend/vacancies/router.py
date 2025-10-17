from fastapi import APIRouter, Depends, HTTPException

from auth.router import get_current_user
from auth.models import User
from vacancies.models import Vacancy, Application
from vacancies.schemas import (
    Vacancy_Pydantic,
    Application_Pydantic,
    VacancyCreate,
    VacancyUpdate,
    ApplicationCreate,
    ApplicationAndId,
)


router = APIRouter(prefix="/vacancies", tags=["vacancies"])


@router.get("/read", response_model=list[Vacancy_Pydantic])
async def get_public_vacancies():
    return await Vacancy_Pydantic.from_queryset(Vacancy.filter(is_active=True))


@router.post("/create", response_model=Vacancy_Pydantic)
async def create_vacancy(
    vacancy_data: VacancyCreate,
    user: User = Depends(get_current_user)
):
    if user.role not in ["admin", "hr"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    vacancy = await Vacancy.create(
        title=vacancy_data.title,
        description=vacancy_data.description,
        company=vacancy_data.company,
        type=vacancy_data.type,
        created_by_id=user.id
    )
    return await Vacancy_Pydantic.from_tortoise_orm(vacancy)


@router.put("/{vacancy_id}", response_model=Vacancy_Pydantic)
async def update_vacancy(vacancy_id: int, vacancy_data: VacancyUpdate, user: User = Depends(get_current_user)):
    if user.role not in ["admin", "hr"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    vacancy = await Vacancy.get_or_none(id=vacancy_id)
    if not vacancy:
        raise HTTPException(status_code=404, detail="Vacancy not found")

    if vacancy.created_by_id != user.id and user.role != "admin":
        raise HTTPException(status_code=403, detail="Can only edit your own vacancies")

    update_data = vacancy_data.dict(exclude_unset=True)
    await vacancy.update_from_dict(update_data)
    await vacancy.save()

    return await Vacancy_Pydantic.from_tortoise_orm(vacancy)


@router.get("/admin/applications", response_model=list[Application_Pydantic])
async def get_all_applications(user: User = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return await Application_Pydantic.from_queryset(Application.all().prefetch_related("vacancy"))


@router.post("/applications", response_model=Application_Pydantic)
async def create_application(application_data: ApplicationCreate):
    vacancy = await Vacancy.get_or_none(id=application_data.vacancy_id, is_active=True)
    if not vacancy:
        raise HTTPException(status_code=404, detail="Vacancy not found or not active")

    application = await Application.create(
        vacancy=vacancy,
        applicant_name=application_data.applicant_name,
        applicant_email=application_data.applicant_email,
        applicant_university=application_data.applicant_university,
        message=application_data.message
    )
    return await Application_Pydantic.from_tortoise_orm(application)


@router.get("/vacancies/", response_model=list[Vacancy_Pydantic])
async def get_my_vacancies(user: User = Depends(get_current_user)):
    """
    get реквест, получает вакансии, созданные данным пользователем
    """

    if user.role not in ["admin", "hr"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    vacancies = Vacancy.filter(created_by=user.id)
    if not vacancies:
        raise HTTPException(status_code=404, detail="Vacancies not found")

    return await Vacancy_Pydantic.from_queryset(vacancies)


@router.get("/my_vacancies", response_model=list[ApplicationAndId])
async def get_applications_for_my_vacancies(user: User = Depends(get_current_user)):
    """
    get реквест, получает все отклики на все вакансии, созданные данным пользователем
    """

    if user.role not in ["admin", "hr"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    applications = await Application.filter(vacancy__created_by=user.id).select_related("vacancy")
    return [ApplicationAndId(vacancy_id=app.vacancy.id, application=app) for app in applications]