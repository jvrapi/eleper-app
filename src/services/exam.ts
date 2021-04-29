import { AxiosResponse } from 'axios';
import { DownloadFileOptions, downloadFile, DownloadDirectoryPath } from 'react-native-fs';
import { Exam } from '../interfaces/exam';
import api from './api';

const baseUrl = '/exam';

export async function getAll(userId: string): Promise<AxiosResponse<Exam[]>> {
  const response = await api.get(`${baseUrl}?id=${userId}`);
  return response;
}

export async function getById(examId: string): Promise<AxiosResponse<Exam>> {
  const response = await api.get(`${baseUrl}/details/${examId}`);
  return response;
}

export async function downloadExam(examId: string, fileName: string) {
  /* const response = await api.get(`${baseUrl}/downloadFile?id=${examId}`);
  console.log(response.config.url);
  return response; */

  const token = api.defaults.headers.Authorization;
  const serverUrl = api.defaults.baseURL;

  const path = `${DownloadDirectoryPath}/${fileName}.pdf`;

  const headers = {
    Accept: 'application/pdf',
    'Content-Type': 'application/pdf',
    Authorization: `${token}`,
  };

  const options: DownloadFileOptions = {
    fromUrl: `${serverUrl}${baseUrl}/downloadFile?id=${examId}`,
    toFile: path,
    headers: headers,
  };
  const response = downloadFile(options);

  try {
    const { statusCode, bytesWritten } = await response.promise;
    if (statusCode === 200 && bytesWritten > 0) {
      return 'Arquivo baixado com sucesso';
    } else {
      throw new Error('Erro ao tentar baixar o arquivo');
    }
  } catch {
    throw new Error('Erro ao tentar baixar o arquivo');
  }
}
