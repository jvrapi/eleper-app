import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import NewUser from '../screens/NewUser';
import NewUserRegisterDisease from '../screens/NewUserRegisterDisease';

const Stack = createStackNavigator();
const NewUserRoutes: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name='NewUser' component={NewUser} />
    <Stack.Screen name='NewUserRegisterDisease' component={NewUserRegisterDisease} />
  </Stack.Navigator>
);

export default NewUserRoutes;
