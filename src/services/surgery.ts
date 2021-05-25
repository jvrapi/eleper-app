import { AxiosResponse } from 'axios';
import { Surgery } from '../interfaces/surgery';
import api from './api';

const baseUrl = '/surgery';

export async function getSurgeries(): Promise<AxiosResponse<Surgery[]>> {
	const response = await api.get(`${baseUrl}/`);
	return response;
}
export async function getByName(name: string): Promise<AxiosResponse<Surgery[]>> {
	const response = await api.get(`${baseUrl}/name/${name}`);
	return response;
}
