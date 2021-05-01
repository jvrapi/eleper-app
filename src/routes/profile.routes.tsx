import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Profile from '../screens/Profile';
import MyRecord from '../screens/MyRecord';

const AuthStack = createStackNavigator();

const ProfileRoutes: React.FC = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name='MyRecord' component={MyRecord} />
      <AuthStack.Screen name='Profile' component={Profile} />
    </AuthStack.Navigator>
  );
};

export default ProfileRoutes;
