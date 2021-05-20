import { AxiosResponse } from 'axios';
import { Annotation, Save } from '../interfaces/annotation';
import api, { DeleteResponse } from './api';

const baseUrl = '/annotation';

export async function list(userId: string): Promise<AxiosResponse<Annotation[]>> {
  const response = await api.get(`${baseUrl}/${userId}`);
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
