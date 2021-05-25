import { AxiosResponse } from 'axios';
import { Medicine } from '../interfaces/medicine';
import api from './api';

const baseUrl = '/medicine';

export async function getMedicines(): Promise<AxiosResponse<Medicine[]>> {
	const response = await api.get(`${baseUrl}/`);
	return response;
}
export async function getByName(name: string): Promise<AxiosResponse<Medicine[]>> {
	const response = await api.get(`${baseUrl}/name/${name}`);
	return response;
}
