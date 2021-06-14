import axios from 'axios';

export type DeleteResponse = Record<string, string>;

const defaultOptions = {
	baseURL: 'http://54.210.242.175:3000',
	headers: {
		'Content-Type': 'application/json',
	},
};

const api = axios.create(defaultOptions);

export default api;
