import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useContext } from 'react';
import { CustomTabBar } from '../components';
import BottomTabBarContext from '../contexts/bottomTabBar';
import Profile from './profile.routes';
import Treatment from '../screens/Treatment';
import Annotations from './annotations.routes';
import Home from './home.routes';

const Tab = createBottomTabNavigator();
const AppRoutes: React.FC = () => {
  const { showTabBar } = useContext(BottomTabBarContext);
  return (
    <Tab.Navigator tabBar={props => showTabBar && <CustomTabBar {...props} />}>
      <Tab.Screen name='Home' component={Home} />
      <Tab.Screen name='Annotations' component={Annotations} />
      <Tab.Screen name='Treatment' component={Treatment} />
      <Tab.Screen name='Profile' component={Profile} />
    </Tab.Navigator>
  );
};

export default AppRoutes;
