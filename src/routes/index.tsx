import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { LoadingComponent } from '../components';
import AuthContext from '../contexts/auth';
import AppRoutes from '../routes/app.routes';
import AuthRoutes from '../routes/auth.routes';

const Routes: React.FC = () => {
	const { user, loading } = useContext(AuthContext);

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
