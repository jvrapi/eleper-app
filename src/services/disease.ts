import { AxiosResponse } from 'axios';
import { Disease } from '../interfaces/disease';
import api from './api';

const baseUrl = '/disease';

export async function getAll(): Promise<AxiosResponse<Disease[]>> {
  const response = await api.get(`${baseUrl}/`);
  return response;
}
