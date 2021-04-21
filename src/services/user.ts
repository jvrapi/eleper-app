import { AxiosResponse } from 'axios';
import { SendMail } from '../interfaces/email';
import { Auth, NewUser, RedefinePassword, StorageData, User } from '../interfaces/user';
import api from './api';

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
