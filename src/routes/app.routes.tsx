import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from '../screens/Home';
import { CustomTabBar } from '../components';

const AuthStack = createBottomTabNavigator();

const AppRoutes: React.FC = () => (
  <AuthStack.Navigator tabBar={props => <CustomTabBar {...props} />}>
    <AuthStack.Screen name='Home' component={Home} />
  </AuthStack.Navigator>
);

export default AppRoutes;
