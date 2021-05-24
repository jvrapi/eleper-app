import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Disease from '../screens/UserDisease';
import NewDisease from '../screens/NewUserDisease';
import UserDiseaseDetails from '../screens/UserDiseaseDetails';

const AuthStack = createStackNavigator();

const DiseaseRoutes: React.FC = () => {
	return (
		<AuthStack.Navigator screenOptions={{ headerShown: false }}>
			<AuthStack.Screen name='Disease' component={Disease} />
			<AuthStack.Screen name='NewDisease' component={NewDisease} />
			<AuthStack.Screen name='UserDiseaseDetails' component={UserDiseaseDetails} />
		</AuthStack.Navigator>
	);
};

export default DiseaseRoutes;
