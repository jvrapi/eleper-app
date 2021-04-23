import { BottomTabBarProps, BottomTabBarOptions } from '@react-navigation/bottom-tabs';
import React from 'react';
import { View, Text } from 'react-native';

const CustomTabBar = ({ state, navigation }: BottomTabBarProps<BottomTabBarOptions>) => {
  const goTo = (screenName: string) => {
    navigation.navigate(screenName);
  };
  return (
    <View>
      <Text>Custom Tab Bar</Text>
    </View>
  );
};

export default CustomTabBar;
