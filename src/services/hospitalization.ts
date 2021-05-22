import { AxiosResponse } from 'axios';
import { Hospitalization } from '../interfaces/hospitalization';
import api, { DeleteResponse } from './api';
const baseUrl = '/hospitalization';

export async function getAll(userId: string): Promise<AxiosResponse<Hospitalization[]>> {
  const response = await api.get(`${baseUrl}/${userId}`);
  return response;
}

export async function deleteMany(hospitalizationIds: string[]): Promise<AxiosResponse<DeleteResponse>> {
  const response = await api.delete(`${baseUrl}`, {
    data: hospitalizationIds,
  });
  return response;
}
