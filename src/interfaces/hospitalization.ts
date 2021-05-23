import { Disease } from './disease';

export interface Hospitalization {
  id: string;
  userId: string;
  surgeryId: string;
  entranceDate: string;
  exitDate: string;
  location: string;
  reason: string;
  diseases: Disease[];
}

export interface Save {
  userId: string;
  entranceDate: string;
  exitDate?: string | null;
  location: string;
  reason: string;
  diseases: string[];
}
