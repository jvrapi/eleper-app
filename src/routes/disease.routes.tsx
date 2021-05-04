import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Disease from '../screens/Disease';

const AuthStack = createStackNavigator();

const DiseaseRoutes: React.FC = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name='Disease' component={Disease} />
    </AuthStack.Navigator>
  );
};

export default DiseaseRoutes;
