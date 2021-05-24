import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Hospitalization from '../screens/Hospitalization';
import NewHospitalization from '../screens/NewHospitalization';
import HospitalizationDetails from '../screens/HospitalizationDetails';

const AuthStack = createStackNavigator();

const HospitalizationRoutes: React.FC = () => {
	return (
		<AuthStack.Navigator screenOptions={{ headerShown: false }}>
			<AuthStack.Screen name='Hospitalization' component={Hospitalization} />
			<AuthStack.Screen name='NewHospitalization' component={NewHospitalization} />
			<AuthStack.Screen name='HospitalizationDetails' component={HospitalizationDetails} />
		</AuthStack.Navigator>
	);
};

export default HospitalizationRoutes;
