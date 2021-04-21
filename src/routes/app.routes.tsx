import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../screens/Home';

const AuthStack = createStackNavigator();

const AppRoutes: React.FC = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name='Home' component={Home} />
  </AuthStack.Navigator>
);

export default AppRoutes;
