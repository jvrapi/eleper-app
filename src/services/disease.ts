import { AxiosResponse } from 'axios';
import { Disease, DiseaseSave } from '../interfaces/disease';
import api from './api';

const baseUrl = '/disease';

export async function getAll(): Promise<AxiosResponse<Disease[]>> {
  const response = await api.get(`${baseUrl}/`);
  return response;
}

export async function save(disease: DiseaseSave) {
  const response = await api.post(`${baseUrl}/`, disease);
  return response;
}
