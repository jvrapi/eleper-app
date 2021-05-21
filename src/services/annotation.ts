import { AxiosResponse } from 'axios';
import { Annotation, Save, Update } from '../interfaces/annotation';
import api, { DeleteResponse } from './api';

const baseUrl = '/annotation';

export async function list(userId: string): Promise<AxiosResponse<Annotation[]>> {
  const response = await api.get(`${baseUrl}/${userId}`);
  return response;
}

export async function getById(id: string): Promise<AxiosResponse<Annotation>> {
  const response = await api.get(`${baseUrl}/details/${id}`);
  return response;
}

export async function deleteMany(annotationIds: string[]): Promise<AxiosResponse<DeleteResponse[]>> {
  const response = await api.delete(`${baseUrl}/`, {
    data: annotationIds,
  });
  return response;
}

export async function save(annotation: Save): Promise<AxiosResponse<Annotation>> {
  const response = await api.post(`${baseUrl}/`, annotation);
  return response;
}

export async function update(annotation: Update): Promise<AxiosResponse<Annotation>> {
  const response = await api.put(`${baseUrl}/`, annotation);
  return response;
}
