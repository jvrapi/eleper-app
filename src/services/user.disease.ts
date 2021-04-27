import api from './api';
import { Save, UserDisease } from '../interfaces/user.disease';
import { AxiosResponse } from 'axios';
const baseUrl = '/userDisease';

export async function getUserDiseases(id: string): Promise<AxiosResponse<UserDisease[]>> {
  const response = await api.get(`${baseUrl}/${id}`);
  return response;
}

export async function saveMany(userDiseases: Save[]): Promise<AxiosResponse<Save[]>> {
  const response = await api.post(`${baseUrl}/saveMany`, userDiseases);
  return response;
}
