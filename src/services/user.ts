import { AxiosResponse } from 'axios';
import { SendMail } from '../interfaces/email';
import { Auth, NewUser, RedefinePassword, StorageData, User, UserDetails } from '../interfaces/user';
import api, { DeleteResponse } from './api';

const baseURL = '/user';

export async function signIn(user: Auth): Promise<AxiosResponse<StorageData>> {
	const response = await api.post(`${baseURL}/authentication`, user);
	return response;
}

export async function signUp(user: NewUser): Promise<AxiosResponse<StorageData>> {
	const response = await api.post(`${baseURL}/`, user);
	return response;
}

export async function sendRedefineCode(email: SendMail): Promise<AxiosResponse<User>> {
	const response = await api.post(`${baseURL}/sendMail`, email);
	return response;
}

export async function redefinePassword(values: RedefinePassword): Promise<AxiosResponse<User>> {
	const response = await api.post(`${baseURL}/redefinePassword`, values);
	return response;
}

export async function getDetails(userId: string): Promise<AxiosResponse<UserDetails>> {
	const response = await api.get(`${baseURL}/details/${userId}`);
	return response;
}

export async function update(user: UserDetails): Promise<AxiosResponse<UserDetails>> {
	const response = await api.put(`${baseURL}/`, user);
	return response;
}

export async function deleteAccount(id: string): Promise<AxiosResponse<DeleteResponse>> {
	const response = await api.delete(`${baseURL}/${id}`);
	return response;
}
