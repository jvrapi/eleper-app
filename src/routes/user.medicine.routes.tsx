import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import UserMedicine from '../screens/UserMedicine';
import NewUserMedicine from '../screens/NewUserMedicine';
import UserMedicineDetails from '../screens/UserMedicineDetails';

const AuthStack = createStackNavigator();

const UserMedicineRoutes: React.FC = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name='UserMedicine' component={UserMedicine} />
      <AuthStack.Screen name='NewUserMedicine' component={NewUserMedicine} />
      <AuthStack.Screen name='UserMedicineDetails' component={UserMedicineDetails} />
    </AuthStack.Navigator>
  );
};

export default UserMedicineRoutes;
