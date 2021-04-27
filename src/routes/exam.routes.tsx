import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Exam from '../screens/Exam';

const AuthStack = createStackNavigator();

const ExamRoutes: React.FC = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name='Exam' component={Exam} />
    </AuthStack.Navigator>
  );
};

export default ExamRoutes;
