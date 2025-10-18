/**
 * Пример API клиента для интеграции с FastAPI backend
 *
 * Использование:
 * 1. Переименуйте этот файл в api.ts
 * 2. Обновите API_URL на адрес вашего backend
 * 3. Импортируйте функции в компонентах
 * 4. Замените моковые данные на эти функции
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Типы данных (совпадают с вашими моделями)
export interface Vacancy {
  id: number;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  salary: string;
  candidates: number;
  status: "active" | "paused" | "closed";
  description: string;
  requirements: string;
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

export interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  skills: string[];
  status: "new" | "interview" | "test-task" | "offer" | "accepted" | "rejected";
  source: string;
  notes: string;
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
  const response = await fetch(`${API_URL}/vacancies`);
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
 * Создать новую вакансию
 */
export async function createVacancy(
  data: Omit<Vacancy, "id" | "candidates">
): Promise<Vacancy> {
  const response = await fetch(`${API_URL}/vacancies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Vacancy>(response);
}

/**
 * Обновить вакансию
 */
export async function updateVacancy(
  id: number,
  data: Partial<Vacancy>
): Promise<Vacancy> {
  const response = await fetch(`${API_URL}/vacancies/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Vacancy>(response);
}

/**
 * Удалить вакансию
 */
export async function deleteVacancy(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/vacancies/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete vacancy: ${response.statusText}`);
  }
}

// ============================================
// СТАЖИРОВКИ API
// ============================================

/**
 * Получить список всех стажировок
 */
export async function getInternships(): Promise<Internship[]> {
  const response = await fetch(`${API_URL}/internships`);
  return handleResponse<Internship[]>(response);
}

/**
 * Получить стажировку по ID
 */
export async function getInternship(id: number): Promise<Internship> {
  const response = await fetch(`${API_URL}/internships/${id}`);
  return handleResponse<Internship>(response);
}

/**
 * Создать новую стажировку
 */
export async function createInternship(
  data: Omit<Internship, "id" | "applicants">
): Promise<Internship> {
  const response = await fetch(`${API_URL}/internships`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Internship>(response);
}

/**
 * Обновить стажировку
 */
export async function updateInternship(
  id: number,
  data: Partial<Internship>
): Promise<Internship> {
  const response = await fetch(`${API_URL}/internships/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Internship>(response);
}

/**
 * Удалить стажировку
 */
export async function deleteInternship(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/internships/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete internship: ${response.statusText}`);
  }
}

// ============================================
// КАНДИДАТЫ API
// ============================================

/**
 * Получить список всех кандидатов
 */
export async function getCandidates(): Promise<Candidate[]> {
  const response = await fetch(`${API_URL}/candidates`);
  return handleResponse<Candidate[]>(response);
}

/**
 * Получить кандидата по ID
 */
export async function getCandidate(id: number): Promise<Candidate> {
  const response = await fetch(`${API_URL}/candidates/${id}`);
  return handleResponse<Candidate>(response);
}

/**
 * Создать нового кандидата
 */
export async function createCandidate(
  data: Omit<Candidate, "id">
): Promise<Candidate> {
  const response = await fetch(`${API_URL}/candidates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Candidate>(response);
}

/**
 * Обновить кандидата
 */
export async function updateCandidate(
  id: number,
  data: Partial<Candidate>
): Promise<Candidate> {
  const response = await fetch(`${API_URL}/candidates/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Candidate>(response);
}

/**
 * Удалить кандидата
 */
export async function deleteCandidate(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/candidates/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete candidate: ${response.statusText}`);
  }
}

// ============================================
// АУТЕНТИФИКАЦИЯ (опционально)
// ============================================

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

/**
 * Войти в систему
 */
export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<AuthResponse>(response);
}

/**
 * Выйти из системы
 */
export async function logout(): Promise<void> {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("Logout failed");
  }
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
