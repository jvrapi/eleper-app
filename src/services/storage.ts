import { StorageData } from '../interfaces/user';

import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../services/api';

export async function storageItems(storageData: StorageData) {
	api.defaults.headers.Authorization = `Bearer ${storageData.token}`;
	await AsyncStorage.setItem('@EMH:user', JSON.stringify(storageData.user));
	await AsyncStorage.setItem('@EMH:token', storageData.token);
}

export async function getStorageItems() {
	const storagedUser = await AsyncStorage.getItem('@EMH:user');
	const storagedToken = await AsyncStorage.getItem('@EMH:token');
	return { storagedUser, storagedToken };
}
