from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import Optional, List


from auth.router import get_current_user
from auth.models import User
from vacancies.models import Vacancy, Application
from vacancies.schemas import (
    Vacancy_Pydantic,
    Application_Pydantic,
    VacancyCreate,
    VacancyUpdate,
    ApplicationCreate,
    ApplicationAndId
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
        vacancy_title=vacancy_data.vacancy_title,
        company_logo=vacancy_data.company_logo,
        company_name=vacancy_data.company_name,
        platform=vacancy_data.platform,
        specialty=vacancy_data.specialty,
        responsibilities=vacancy_data.responsibilities,
        requirements=vacancy_data.requirements,
        employment_type=vacancy_data.employment_type,
        schedule=vacancy_data.schedule,
        location=vacancy_data.location,
        location_yandex_link=vacancy_data.location_yandex_link,
        probation=vacancy_data.probation,
        salary=vacancy_data.salary,
        extra_info=vacancy_data.extra_info,
        link_text=vacancy_data.link_text,
        company_website=vacancy_data.company_website,
        promo_video=vacancy_data.promo_video,
        status=vacancy_data.status,
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


@router.post("/bitrix-form-json")
async def receive_bitrix_form_json(vacancy_data: VacancyCreate):
    # Тут вы можете сохранить данные в БД, лог, отправить в Telegram и т.д.
    # Для Bitrix создаем вакансию без привязки к пользователю (created_by_id=None)
    vacancy = await Vacancy.create(
        vacancy_title=vacancy_data.vacancy_title,
        company_logo=vacancy_data.company_logo,
        company_name=vacancy_data.company_name,
        platform=vacancy_data.platform,
        specialty=vacancy_data.specialty,
        responsibilities=vacancy_data.responsibilities,
        requirements=vacancy_data.requirements,
        employment_type=vacancy_data.employment_type,
        schedule=vacancy_data.schedule,
        location=vacancy_data.location,
        location_yandex_link=vacancy_data.location_yandex_link,
        probation=vacancy_data.probation,
        salary=vacancy_data.salary,
        extra_info=vacancy_data.extra_info,
        link_text=vacancy_data.link_text,
        company_website=vacancy_data.company_website,
        promo_video=vacancy_data.promo_video,
        status="pending",  # Bitrix вакансии всегда pending
        created_by_id=None  # Bitrix не привязан к пользователю
    )
    return {"status": "ok", "received": vacancy_data.dict()}


@router.post('/bitrix-form')
async def receive_bitrix_form(
    vacancy_title: str = Form(...),
    company_logo: Optional[UploadFile] = File(None),
    company_name: str = Form(...),
    platform: str = Form(...),
    specialty: str = Form(...),
    responsibilities: str = Form(...),  # JSON string from form
    requirements: str = Form(...),  # JSON string from form
    employment_type: Optional[str] = Form(None),
    schedule: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    location_yandex_link: Optional[str] = Form(None),
    probation: Optional[str] = Form(None),
    salary: Optional[str] = Form(None),
    extra_info: Optional[str] = Form(None),
    link_text: Optional[str] = Form(None),
    company_website: Optional[str] = Form(None),
    promo_video: Optional[str] = Form(None),
):
    import json
    
    # Parse JSON strings for responsibilities and requirements
    try:
        responsibilities_list = json.loads(responsibilities) if responsibilities else []
        requirements_list = json.loads(requirements) if requirements else []
    except json.JSONDecodeError:
        # If JSON parsing fails, treat as single item lists
        responsibilities_list = [responsibilities] if responsibilities else []
        requirements_list = [requirements] if requirements else []
    
    # Handle file upload for company logo
    company_logo_url = None
    if company_logo:
        # Here you would typically save the file and get a URL
        # For now, we'll just store the filename
        company_logo_url = company_logo.filename
    
    form_data = {
        "vacancy_title": vacancy_title,
        "company_logo": company_logo_url,
        "company_name": company_name,
        "platform": platform,
        "specialty": specialty,
        "responsibilities": responsibilities_list,
        "requirements": requirements_list,
        "employment_type": employment_type,
        "schedule": schedule,
        "location": location,
        "location_yandex_link": location_yandex_link,
        "probation": probation,
        "salary": salary,
        "extra_info": extra_info,
        "link_text": link_text,
        "company_website": company_website,
        "promo_video": promo_video,
    }
    
    vacancy = await Vacancy.create(
        created_by_id=None,  # Bitrix не привязан к пользователю
        status="pending",
        **form_data
    )
    return {"status": "ok", "received": form_data}