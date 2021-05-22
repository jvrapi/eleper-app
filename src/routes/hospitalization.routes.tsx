import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Hospitalization from '../screens/Hospitalization';

const AuthStack = createStackNavigator();

const HospitalizationRoutes: React.FC = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name='Hospitalization' component={Hospitalization} />
    </AuthStack.Navigator>
  );
};

export default HospitalizationRoutes;
