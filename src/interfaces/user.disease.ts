import { Disease } from './disease';
import { User } from './user';

export interface Save {
  userId: string;
  diseaseId: string;
  active?: boolean;
  diagnosisDate?: Date;
}

export interface UserDisease {
  user: User;
  disease: Disease;
  active?: boolean;
  diagnosisDate?: string;
}
