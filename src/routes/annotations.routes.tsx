import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Annotations from '../screens/Annotations';
import NewAnnotation from '../screens/NewAnnotation';

const AuthStack = createStackNavigator();

const HomeRoutes: React.FC = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name='Annotations' component={Annotations} />
      <AuthStack.Screen name='NewAnnotation' component={NewAnnotation} />
    </AuthStack.Navigator>
  );
};

export default HomeRoutes;
