export interface Annotation {
  id: string;
  createdAt: string;
  description: string;
  userId: string;
  diseaseId: string;
}

export interface Save {
  diseaseId?: string;
  description: string;
  userId: string;
}
