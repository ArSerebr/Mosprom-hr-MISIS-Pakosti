/**
 * API клиент для интеграции с FastAPI backend
 * 
 * Этот файл содержит все функции для работы с API вакансий и откликов
 */

const API_URL = typeof window !== 'undefined' 
  ? (window as any).ENV?.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
  : "http://localhost:8000/api";

// Типы для авторизации
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'hr' | 'university';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'hr' | 'university';
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

// Типы данных (совпадают с вашими моделями)
export interface Vacancy {
  id: number;
  vacancy_title: string;
  company_logo?: string;
  company_name: string;
  platform: string;
  specialty: string;
  responsibilities: string[];
  requirements: string[];
  employment_type?: string;
  schedule?: string;
  location?: string;
  location_yandex_link?: string;
  probation?: string;
  salary?: string;
  extra_info?: string;
  link_text?: string;
  company_website?: string;
  promo_video?: string;
  status: "pending" | "approve" | "rejected";
  is_active: boolean;
  created_by?: number;
  created_at: string;
  applications?: Application[]; // Добавляем поле для откликов
}

export interface Internship {
  id: number;
  title: string;
  department: string;
  duration: string;
  startDate: string;
  endDate: string;
  spots: number;
  applicants: number;
  status: "open" | "in-progress" | "completed";
  description: string;
  requirements: string;
}

export interface Application {
  id: number;
  vacancy: number; // ID вакансии
  vacancy_data?: Vacancy; // Полная информация о вакансии
  applicant_name: string;
  applicant_email: string;
  message?: string;
  status: "pending" | "approve" | "rejected";
  created_at: string;
}

export interface ApplicationCreate {
  vacancy_id?: number | null;
  applicant_name: string;
  applicant_email: string;
  message?: string;
}

// Утилита для обработки ошибок
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "Unknown error" }));
    throw new Error(
      error.detail || `HTTP ${response.status}: ${response.statusText}`
    );
  }
  return response.json();
}

// ============================================
// ВАКАНСИИ API
// ============================================

/**
 * Получить список всех вакансий
 */
export async function getVacancies(): Promise<Vacancy[]> {
  const response = await fetch(`${API_URL}/vacancies/read`);
  return handleResponse<Vacancy[]>(response);
}

/**
 * Получить вакансию по ID
 */
export async function getVacancy(id: number): Promise<Vacancy> {
  const response = await fetch(`${API_URL}/vacancies/${id}`);
  return handleResponse<Vacancy>(response);
}

/**
 * Получить вакансии пользователя
 */
export async function getMyVacancies(token: string): Promise<Vacancy[]> {
  const response = await fetch(`${API_URL}/vacancies/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return handleResponse<Vacancy[]>(response);
}

/**
 * Создать новую вакансию
 */
export async function createVacancy(
  data: Omit<Vacancy, "id" | "created_at" | "is_active">,
  token: string
): Promise<Vacancy> {
  const response = await fetch(`${API_URL}/vacancies/create`, {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<Vacancy>(response);
}

/**
 * Обновить вакансию
 */
export async function updateVacancy(
  id: number,
  data: Partial<Vacancy>,
  token: string
): Promise<Vacancy> {
  const response = await fetch(`${API_URL}/vacancies/${id}`, {
    method: "PUT",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<Vacancy>(response);
}

/**
 * Удалить вакансию
 */
export async function deleteVacancy(id: number, token: string): Promise<void> {
  const response = await fetch(`${API_URL}/vacancies/${id}`, {
    method: "DELETE",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to delete vacancy: ${response.statusText}`);
  }
}

// ============================================
// ОТКЛИКИ API
// ============================================

/**
 * Получить все отклики на вакансии пользователя
 */
export async function getMyApplications(token: string): Promise<Application[]> {
  const response = await fetch(`${API_URL}/vacancies/my_vacancies`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return handleResponse<Application[]>(response);
}

/**
 * Получить все отклики (для админа)
 */
export async function getAllApplications(token: string): Promise<Application[]> {
  const response = await fetch(`${API_URL}/vacancies/admin/applications`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return handleResponse<Application[]>(response);
}

/**
 * Получить всех кандидатов (отклики с информацией о вакансиях)
 */
export async function getAllCandidates(token: string): Promise<Application[]> {
  const response = await fetch(`${API_URL}/vacancies/candidates`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return handleResponse<Application[]>(response);
}

/**
 * Создать отклик на вакансию
 */
export async function createApplication(data: ApplicationCreate): Promise<Application> {
  const response = await fetch(`${API_URL}/vacancies/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Application>(response);
}

/**
 * Создать кандидата вручную (для HR/админов)
 */
export async function createCandidate(
  data: ApplicationCreate,
  token: string
): Promise<Application> {
  const response = await fetch(`${API_URL}/vacancies/candidates`, {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<Application>(response);
}

/**
 * Обновить статус отклика
 */
export async function updateApplicationStatus(
  id: number,
  status: "pending" | "approve" | "rejected",
  token: string
): Promise<Application> {
  const response = await fetch(`${API_URL}/vacancies/applications/${id}`, {
    method: "PUT",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  return handleResponse<Application>(response);
}

/**
 * Получить отклики на конкретную вакансию
 */
export async function getVacancyApplications(
  vacancyId: number,
  token: string
): Promise<Application[]> {
  const response = await fetch(`${API_URL}/vacancies/${vacancyId}/applications`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return handleResponse<Application[]>(response);
}

// ============================================
// АУТЕНТИФИКАЦИЯ
// ============================================

/**
 * Войти в систему
 */
export async function loginUser(credentials: LoginRequest): Promise<TokenResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return handleResponse<TokenResponse>(response);
}

/**
 * Зарегистрировать пользователя
 */
export async function registerUser(userData: RegisterRequest): Promise<User> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return handleResponse<User>(response);
}

/**
 * Получить текущего пользователя
 */
export async function getCurrentUser(token: string): Promise<User> {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return handleResponse<User>(response);
}

/**
 * Создать авторизованный запрос
 */
export function createAuthenticatedRequest(token: string, url: string, options: RequestInit = {}): Promise<Response> {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}

// ============================================
// ПРИМЕР ИСПОЛЬЗОВАНИЯ В КОМПОНЕНТЕ
// ============================================

/*
// В компоненте страницы вакансий:

'use client';

import { useState, useEffect } from 'react';
import { getVacancies, createVacancy, updateVacancy, deleteVacancy } from '@/lib/api';
import { notifications } from '@mantine/notifications';

export default function VacanciesPage() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Загрузка данных при монтировании
  useEffect(() => {
    loadVacancies();
  }, []);

  const loadVacancies = async () => {
    try {
      setLoading(true);
      const data = await getVacancies();
      setVacancies(data);
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: error.message,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values) => {
    try {
      const newVacancy = await createVacancy(values);
      setVacancies([...vacancies, newVacancy]);
      notifications.show({
        title: 'Успешно',
        message: 'Вакансия создана',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: error.message,
        color: 'red',
      });
    }
  };

  const handleUpdate = async (id, values) => {
    try {
      const updated = await updateVacancy(id, values);
      setVacancies(vacancies.map(v => v.id === id ? updated : v));
      notifications.show({
        title: 'Успешно',
        message: 'Вакансия обновлена',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: error.message,
        color: 'red',
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteVacancy(id);
      setVacancies(vacancies.filter(v => v.id !== id));
      notifications.show({
        title: 'Успешно',
        message: 'Вакансия удалена',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: error.message,
        color: 'red',
      });
    }
  };

  // ... остальной код компонента
}
*/

// ============================================
// КОНФИГУРАЦИЯ CORS НА BACKEND
// ============================================

/*
# В вашем FastAPI backend добавьте:

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # В production замените на ваш домен
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
*/

// ============================================
// ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ
// ============================================

/*
# Создайте файл .env.local в корне frontend проекта:

NEXT_PUBLIC_API_URL=http://localhost:8000/api

# В production:
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
*/
