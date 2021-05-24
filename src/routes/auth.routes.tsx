import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import InitialScreen from '../screens/InitialScreen';
import ForgotPassword from '../screens/ForgotPassword';

const AuthStack = createStackNavigator();

const AuthRoutes: React.FC = () => (
	<AuthStack.Navigator screenOptions={{ headerShown: false }} initialRouteName='InitialScreen'>
		<AuthStack.Screen name='InitialScreen' component={InitialScreen} />
		<AuthStack.Screen name='SignIn' component={SignIn} />
		<AuthStack.Screen name='SignUp' component={SignUp} />
		<AuthStack.Screen name='ForgotPassword' component={ForgotPassword} />
	</AuthStack.Navigator>
);

export default AuthRoutes;
