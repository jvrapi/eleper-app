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
