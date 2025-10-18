// Типы для канбан-доски
export type CandidateStatus = 'new' | 'interview' | 'test' | 'offer' | 'accepted' | 'rejected';

export interface BoardCandidate {
  id: string;
  name: string;
  email: string;
  position: string;
  company: string;
  experience: string;
  skills: string[];
  status: CandidateStatus;
  createdAt: Date;
  notes?: string;
}

export interface BoardColumn {
  id: CandidateStatus;
  title: string;
  candidates: BoardCandidate[];
  color: string;
}

export interface Vacancy {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
}
