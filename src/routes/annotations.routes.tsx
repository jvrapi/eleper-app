import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Annotations from '../screens/Annotations';

const AuthStack = createStackNavigator();

const HomeRoutes: React.FC = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name='Annotations' component={Annotations} />
    </AuthStack.Navigator>
  );
};

export default HomeRoutes;
