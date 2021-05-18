import api, { DeleteResponse } from './api';
import { AxiosResponse } from 'axios';
import { UserMedicine } from '../interfaces/user.medicine';
const baseUrl = '/userMedicine';

export async function getAll(userId: string): Promise<AxiosResponse<UserMedicine[]>> {
  const response = await api.get(`${baseUrl}/${userId}`);
  return response;
}

export async function deleteMany(userMedicines: string[]): Promise<AxiosResponse<DeleteResponse[]>> {
  const response = await api.delete(`${baseUrl}/`, {
    data: userMedicines,
  });
  return response;
}
