import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Exam from '../screens/Exam';
import ExamDetails from '../screens/ExamDetails';
import NewExam from '../screens/NewExam';

const AuthStack = createStackNavigator();

const ExamRoutes: React.FC = () => {
	return (
		<AuthStack.Navigator screenOptions={{ headerShown: false }}>
			<AuthStack.Screen name='Exam' component={Exam} />
			<AuthStack.Screen name='ExamDetails' component={ExamDetails} />
			<AuthStack.Screen name='NewExam' component={NewExam} />
		</AuthStack.Navigator>
	);
};

export default ExamRoutes;
