import { Disease } from './disease';
import { Medicine } from './medicine';

export interface Save {
  name: string;
  amount: number;
  instruction: string;
  active: boolean;
  beginDate: string;
  endDate: string;
}

export interface UserMedicine {
  id: string;
  medicine: Medicine;
  disease: Disease;
  amount: number;
  instruction: string;
  beginDate: string;
  endDate: string;
}
