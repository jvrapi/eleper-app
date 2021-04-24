import React, { useContext } from 'react';

import Home from '../screens/Home';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CustomTabBar } from '../components';
import BottomTabBarContext from '../contexts/bottomTabBar';

const Tab = createBottomTabNavigator();

const HomeRoutes: React.FC = () => {
  const { showTabBar } = useContext(BottomTabBarContext);

  return (
    <Tab.Navigator tabBar={props => showTabBar && <CustomTabBar {...props} />}>
      <Tab.Screen name='Home' component={Home} options={{ tabBarVisible: false }} />
    </Tab.Navigator>
  );
};

export default HomeRoutes;
