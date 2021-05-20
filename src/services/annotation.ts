import { AxiosResponse } from 'axios';
import { Annotation } from '../interfaces/annotations';
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
