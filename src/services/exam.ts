import api from './api';

const baseUrl = '/exam';

export async function getAll(userId: string) {
  const response = await api.get(`${baseUrl}/${userId}`);
  return response;
}
