import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Exam from '../screens/Exam';
import ExamDetails from '../screens/ExamDetails';

const AuthStack = createStackNavigator();

const ExamRoutes: React.FC = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name='Exam' component={Exam} />
      <AuthStack.Screen name='ExamDetails' component={ExamDetails} />
    </AuthStack.Navigator>
  );
};

export default ExamRoutes;
