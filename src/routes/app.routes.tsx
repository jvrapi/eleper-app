import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Annotations from '../screens/Annotations';
import Profile from '../screens/Profile';
import Treatment from '../screens/Treatment';
import Home from './home.routes';

const AppBottomRoutes = createStackNavigator();

const AppRoutes: React.FC = () => (
  <AppBottomRoutes.Navigator screenOptions={{ headerShown: false }}>
    <AppBottomRoutes.Screen name='Home' component={Home} />
    <AppBottomRoutes.Screen name='Annotations' component={Annotations} />
    <AppBottomRoutes.Screen name='Treatment' component={Treatment} />
    <AppBottomRoutes.Screen name='Profile' component={Profile} />
  </AppBottomRoutes.Navigator>
);

export default AppRoutes;
