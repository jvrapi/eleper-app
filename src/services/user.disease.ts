import api from './api';
import { Save } from '../interfaces/user.disease';
const baseUrl = '/userDisease';

export async function getUserDiseases(id: string) {
  const response = await api.get(`${baseUrl}/${id}`);
  return response;
}

export async function saveMany(userDiseases: Save[]) {
  const response = await api.post(`${baseUrl}/saveMany`, userDiseases);
  return response;
}
