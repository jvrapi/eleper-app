import axios from 'axios';

const defaultOptions = {
  baseURL: 'http://10.0.2.2:3333/',
  headers: {
    'Content-Type': 'application/json',
  },
};

const api = axios.create(defaultOptions);

export default api;
