import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from '../screens/Home';
import Annotations from '../screens/Annotations';
import Treatment from '../screens/Treatment';
import Profile from '../screens/Profile';
import { CustomTabBar } from '../components';

const AuthStack = createBottomTabNavigator();

const AppRoutes: React.FC = () => (
  <AuthStack.Navigator tabBar={props => <CustomTabBar {...props} />}>
    <AuthStack.Screen name='Home' component={Home} />
    <AuthStack.Screen name='Annotations' component={Annotations} />
    <AuthStack.Screen name='Treatment' component={Treatment} />
    <AuthStack.Screen name='Profile' component={Profile} />
  </AuthStack.Navigator>
);

export default AppRoutes;
