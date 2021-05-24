import { AxiosResponse } from 'axios';
import { Hospitalization, Save } from '../interfaces/hospitalization';
import api, { DeleteResponse } from './api';
const baseUrl = '/hospitalization';

export async function getAll(userId: string): Promise<AxiosResponse<Hospitalization[]>> {
  const response = await api.get(`${baseUrl}/${userId}`);
  return response;
}

export async function getById(id: string): Promise<AxiosResponse<Hospitalization>> {
  const response = await api.get(`${baseUrl}/details/${id}`);
  return response;
}

export async function deleteMany(hospitalizationIds: string[]): Promise<AxiosResponse<DeleteResponse>> {
  const response = await api.delete(`${baseUrl}`, {
    data: hospitalizationIds,
  });
  return response;
}

export async function save(hospitalization: Save): Promise<AxiosResponse<Hospitalization>> {
  const response = await api.post(`${baseUrl}`, hospitalization);
  return response;
}

export async function update(hospitalization: Hospitalization): Promise<AxiosResponse<Hospitalization>> {
  const response = await api.put(`${baseUrl}`, hospitalization);
  return response;
}
