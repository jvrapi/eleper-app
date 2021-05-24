import api, { DeleteResponse } from './api';
import { AxiosResponse } from 'axios';
import { UserSurgery, Save, Update } from '../interfaces/user.surgery';
const baseUrl = '/userSurgery';

export async function getAll(userId: string): Promise<AxiosResponse<UserSurgery[]>> {
	const response = await api.get(`${baseUrl}/${userId}`);
	return response;
}

export async function deleteMany(userMedicines: string[]): Promise<AxiosResponse<DeleteResponse[]>> {
	const response = await api.delete(`${baseUrl}/`, {
		data: userMedicines,
	});
	return response;
}

export async function saveMany(userMedicines: Save): Promise<AxiosResponse<UserSurgery>> {
	const response = await api.post(`${baseUrl}/`, userMedicines);
	return response;
}

export async function getById(id: string): Promise<AxiosResponse<UserSurgery>> {
	const response = await api.get(`${baseUrl}/details/${id}`);
	return response;
}

export async function update(userMedicines: Update): Promise<AxiosResponse<UserSurgery>> {
	const response = await api.put(`${baseUrl}/`, userMedicines);
	return response;
}
