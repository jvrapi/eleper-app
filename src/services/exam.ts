import { AxiosResponse } from 'axios';
import { showMessage } from 'react-native-flash-message';
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
  const token = api.defaults.headers.Authorization;
  const serverUrl = api.defaults.baseURL;

  const path = `${DownloadDirectoryPath}/${fileName}.pdf`;

  const headers = {
    Accept: 'application/pdf',
    'Content-Type': 'application/pdf',
    Authorization: `${token}`,
  };

  const options: DownloadFileOptions = {
    fromUrl: `${serverUrl}${baseUrl}/downloadFile?id=${examId}&type=view`,
    toFile: path,
    headers: headers,
  };
  const response = downloadFile(options);

  response.promise.then(async res => {
    if (res && res.statusCode === 200 && res.bytesWritten > 0) {
      showMessage({
        message: 'Arquivo baixado com sucesso. Verifique na sua pasta de downloads',
        type: 'success',
        icon: 'success',
      });
    } else {
      showMessage({
        message: 'Ocorreu um erro ao tentar baixar o arquivo',
        type: 'danger',
        icon: 'danger',
      });
    }
  });
}
