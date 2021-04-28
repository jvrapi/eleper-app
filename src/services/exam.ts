import api from './api';

const baseUrl = '/exam';

export async function getAll(userId: string) {
  const response = await api.get(`${baseUrl}/${userId}`);
  return response;
}

export async function getById(examId: string) {
  const response = await api.get(`${baseUrl}/details/${examId}`);
  return response;
}
