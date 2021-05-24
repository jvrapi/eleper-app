import React, { createContext, useEffect, useState } from 'react';
import { signIn } from '../services/user';
import api from '../services/api';
import { showMessage } from 'react-native-flash-message';
import { getStorageItems, storageItems } from '../services/storage';
import { User } from '../interfaces/user';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthCredentials {
	username: string;
	password: string;
}

interface AuthContextData {
	user: User | null;
	loading: boolean;
	auth(credentials: AuthCredentials): Promise<void>;
	signOut(): void;
	setUser(user: User): void;
}
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadStorageData() {
			const { storagedUser, storagedToken } = await getStorageItems();

			if (storagedUser && storagedToken) {
				setUser(JSON.parse(storagedUser));
			}
			setLoading(false);
			api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
		}

		loadStorageData();
	}, [user]);

	async function auth(credentials: AuthCredentials) {
		try {
			const { data } = await signIn(credentials);
			setUser(data.user);

			await storageItems(data);
		} catch (error) {
			showMessage({
				message: error.response.data.error,
				type: 'danger',
				icon: 'danger',
			});
			throw new Error(error.response.data.error);
		}
	}

	async function signOut() {
		await AsyncStorage.clear();
		setUser(null);
	}

	return <AuthContext.Provider value={{ user, auth, signOut, loading, setUser }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
