import { Disease } from './disease';
import { Medicine } from './medicine';

export interface Save {
  amount: string;
  instruction: string;
  beginDate: string;
  endDate: string | null;
  userId: string;
  diseaseId: string;
  medicine: {
    name: string;
  };
}

export interface UserMedicine {
  id: string;
  medicine: Medicine;
  disease: Disease;
  amount: string;
  instruction: string;
  beginDate: string;
  endDate: string;
}
