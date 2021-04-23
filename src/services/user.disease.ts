import api from './api';

const baseUrl = '/userDisease';

export async function getUserDiseases(id: string) {
  const response = await api.get(`${baseUrl}/${id}`);
  return response;
}
