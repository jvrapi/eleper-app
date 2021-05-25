import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Profile from '../screens/Profile';
import UserDetails from '../screens/UserDetails';

const AuthStack = createStackNavigator();

const ProfileRoutes: React.FC = () => {
	return (
		<AuthStack.Navigator screenOptions={{ headerShown: false }}>
			<AuthStack.Screen name='Profile' component={Profile} />
			<AuthStack.Screen name='UserDetails' component={UserDetails} />
		</AuthStack.Navigator>
	);
};

export default ProfileRoutes;
