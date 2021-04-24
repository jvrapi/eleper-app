import React, { useContext } from 'react';

import Home from '../screens/Home';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CustomTabBar } from '../components';
import BottomTabBarContext from '../contexts/bottomTabBar';

const AuthStack = createBottomTabNavigator();

const HomeRoutes: React.FC = () => {
  const { showTabBar } = useContext(BottomTabBarContext);

  return (
    <AuthStack.Navigator tabBar={props => showTabBar && <CustomTabBar {...props} />}>
      <AuthStack.Screen name='Home' component={Home} options={{ tabBarVisible: false }} />
    </AuthStack.Navigator>
  );
};

export default HomeRoutes;
