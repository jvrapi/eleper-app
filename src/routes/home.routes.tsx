import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';
import NewUser from './new.user.routes';

const AuthStack = createStackNavigator();

const HomeRoutes: React.FC = () => {
	return (
		<AuthStack.Navigator screenOptions={{ headerShown: false }}>
			<AuthStack.Screen name='Home' component={Home} />
			<AuthStack.Screen name='NewUser' component={NewUser} />
		</AuthStack.Navigator>
	);
};

export default HomeRoutes;
