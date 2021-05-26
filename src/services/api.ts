import axios from 'axios';

export type DeleteResponse = Record<string, string>;

const defaultOptions = {
	baseURL: 'http://192.168.100.63:3000',
	headers: {
		'Content-Type': 'application/json',
	},
};

const api = axios.create(defaultOptions);

export default api;
