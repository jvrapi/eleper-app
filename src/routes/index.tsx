import React, { useContext, useEffect } from 'react';
import AuthContext from '../contexts/auth';

import AuthRoutes from '../routes/auth.routes';
import AppRoutes from '../routes/app.routes';
import { LoadingComponent } from '../components';
import { View, StyleSheet, Keyboard } from 'react-native';
import BottomTabBarContext from '../contexts/bottomTabBar';

const Routes: React.FC = () => {
	const { user, loading } = useContext(AuthContext);
	const { setShowTabBar } = useContext(BottomTabBarContext);

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
			setShowTabBar(false);
		});
		const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
			setShowTabBar(true);
		});

		return () => {
			keyboardDidHideListener.remove();
			keyboardDidShowListener.remove();
		};
	}, []);

	if (loading) {
		return (
			<View style={styles.container}>
				<LoadingComponent />
			</View>
		);
	}

	return user ? <AppRoutes /> : <AuthRoutes />;
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default Routes;
