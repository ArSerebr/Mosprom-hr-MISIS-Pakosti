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
  title: string;
  company: string;
  department: string;
  location: string;
  employmentType: string;
  salary: string;
  description: string;
  requirements: string;
  contactEmail: string;
  contactPhone: string;
  status:
    | "draft"
    | "pending"
    | "approved"
    | "rejected"
    | "published"
    | "archived";
  autoUnpublishDate?: string;
  createdAt: string;
  publishedAt?: string;
  hrId: number;
  responsesCount: number;
  moderatorComment?: string;
}

export interface Response {
  id: number;
  vacancyId: number;
  vacancy?: Vacancy; // Полная информация о вакансии
  candidateId: number;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  resumeUrl?: string;
  resumeData?: CandidateProfile;
  status: "new" | "viewed" | "interview" | "rejected" | "accepted";
  createdAt: string;
  coverLetter?: string;
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
