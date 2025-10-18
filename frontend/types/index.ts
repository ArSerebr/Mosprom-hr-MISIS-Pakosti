// Общие типы для приложения

export type UserRole = "hr" | "candidate" | "university" | "moderator";

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  company?: string;
  university?: string;
}

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
}

export interface Application {
  id: number;
  vacancy: number; // ID вакансии
  vacancy_data?: Vacancy; // Полная информация о вакансии
  applicant_name: string;
  applicant_email: string;
  applicant_university: string;
  message?: string;
  status: "pending" | "approve" | "rejected";
  created_at: string;
}

export interface CandidateProfile {
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  education: string;
  skills: string[];
  about: string;
  vacancyId?: number; // Привязка к вакансии
  vacancy?: Vacancy; // Полная информация о вакансии
}

export interface InternshipRequest {
  id: number;
  universityId: number;
  universityName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  specialty: string;
  studentsCount: number;
  startDate: string;
  endDate: string;
  description: string;
  requirements: string;
  status: "published" | "archived";
  responsesCount: number;
  createdAt: string;
}

export interface InternshipResponse {
  id: number;
  requestId: number;
  companyId: number;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  offeredSlots: number;
  description: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  type:
    | "new_response"
    | "vacancy_approved"
    | "vacancy_rejected"
    | "new_internship";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}
