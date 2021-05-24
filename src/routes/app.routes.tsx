import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useContext } from 'react';
import { CustomTabBar } from '../components';
import BottomTabBarContext from '../contexts/bottomTabBar';
import Profile from './profile.routes';
import Annotations from './annotations.routes';
import Home from './home.routes';
import Exam from './exam.routes';
import Disease from './disease.routes';
import Hospitalization from './hospitalization.routes';
import UserMedicine from './user.medicine.routes';
import UserSurgery from './user.surgery.routes';

const Tab = createBottomTabNavigator();

const AppRoutes: React.FC = () => {
	const { showTabBar } = useContext(BottomTabBarContext);
	return (
		<Tab.Navigator tabBar={props => showTabBar && <CustomTabBar {...props} />}>
			<Tab.Screen name='Home' component={Home} />
			<Tab.Screen name='Exam' component={Exam} />
			<Tab.Screen name='UserMedicine' component={UserMedicine} />
			<Tab.Screen name='Profile' component={Profile} />
			<Tab.Screen name='Annotations' component={Annotations} />
			<Tab.Screen name='Disease' component={Disease} />
			<Tab.Screen name='Hospitalization' component={Hospitalization} />
			<Tab.Screen name='UserSurgery' component={UserSurgery} />
		</Tab.Navigator>
	);
};

export default AppRoutes;
