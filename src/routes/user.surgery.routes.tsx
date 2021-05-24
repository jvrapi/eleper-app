import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import UserSurgery from '../screens/UserSurgery';

const AuthStack = createStackNavigator();

const UserSurgeryRoutes: React.FC = () => {
	return (
		<AuthStack.Navigator screenOptions={{ headerShown: false }}>
			<AuthStack.Screen name='UserSurgery' component={UserSurgery} />
		</AuthStack.Navigator>
	);
};

export default UserSurgeryRoutes;
