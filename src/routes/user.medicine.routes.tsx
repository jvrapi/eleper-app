import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import UserMedicine from '../screens/UserMedicine';
import NewUserMedicine from '../screens/NewUserMedicine';

const AuthStack = createStackNavigator();

const UserMedicineRoutes: React.FC = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name='UserMedicine' component={UserMedicine} />
      <AuthStack.Screen name='NewUserMedicine' component={NewUserMedicine} />
    </AuthStack.Navigator>
  );
};

export default UserMedicineRoutes;
