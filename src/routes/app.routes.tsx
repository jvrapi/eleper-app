import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Annotations from '../screens/Annotations';
import Profile from '../screens/Profile';
import Treatment from '../screens/Treatment';
import NewUser from './new.user.routes';
import Home from './home.routes';

const Stack = createStackNavigator();

const AppRoutes: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name='Home' component={Home} />
    <Stack.Screen name='Annotations' component={Annotations} />
    <Stack.Screen name='Treatment' component={Treatment} />
    <Stack.Screen name='Profile' component={Profile} />
    <Stack.Screen name='NewUser' component={NewUser} />
  </Stack.Navigator>
);

export default AppRoutes;
