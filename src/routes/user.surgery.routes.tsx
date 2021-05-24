import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import UserSurgery from '../screens/UserSurgery';
import NewUserSurgery from '../screens/NewUserSurgery';
import UserSurgeryDetails from '../screens/UserSurgeryDetails';

const AuthStack = createStackNavigator();

const UserSurgeryRoutes: React.FC = () => {
	return (
		<AuthStack.Navigator screenOptions={{ headerShown: false }}>
			<AuthStack.Screen name='UserSurgery' component={UserSurgery} />
			<AuthStack.Screen name='NewUserSurgery' component={NewUserSurgery} />
			<AuthStack.Screen name='UserSurgeryDetails' component={UserSurgeryDetails} />
		</AuthStack.Navigator>
	);
};

export default UserSurgeryRoutes;
