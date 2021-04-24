import { BottomTabBarProps, BottomTabBarOptions } from '@react-navigation/bottom-tabs';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../../assets/styles';
import { TouchableOpacity } from 'react-native-gesture-handler';

const CustomTabBar = ({ state, navigation }: BottomTabBarProps<BottomTabBarOptions>) => {
  const goTo = (screenName: string) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={[styles.container, styles.shadow]}>
      <View style={styles.tabItem}>
        <TouchableOpacity style={styles.button}>
          <AntDesignIcons
            name='home'
            size={30}
            color={state.index === 0 ? colors.iconFocused : colors.iconInactive}
            onPress={() => goTo('Home')}
          />
          <Text style={[styles.screenTitle, { color: state.index === 0 ? colors.iconFocused : colors.iconInactive }]}>Inicio</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabItem}>
        <TouchableOpacity style={styles.button}>
          <MaterialCommunityIcons
            name='notebook-outline'
            size={30}
            color={state.index === 1 ? colors.iconFocused : colors.iconInactive}
            onPress={() => goTo('Annotations')}
          />
          <Text style={[styles.screenTitle, { color: state.index === 1 ? colors.iconFocused : colors.iconInactive }]}>Anotações</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabItem}>
        <TouchableOpacity style={styles.button}>
          <FontAwesome5Icons name='briefcase-medical' size={30} color={state.index === 2 ? colors.iconFocused : colors.iconInactive} />
          <Text style={[styles.screenTitle, { color: state.index === 2 ? colors.iconFocused : colors.iconInactive }]}>Tratamentos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabItem}>
        <TouchableOpacity style={styles.button}>
          <MaterialCommunityIcons
            name='account-settings-outline'
            size={30}
            color={state.index === 3 ? colors.iconFocused : colors.iconInactive}
          />
          <Text style={[styles.screenTitle, { color: state.index === 3 ? colors.iconFocused : colors.iconInactive }]}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    elevation: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    height: 90,
    flexDirection: 'row',

    padding: 10,
  },

  shadow: {
    shadowColor: '#2974FA',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 10,
  },

  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  screenTitle: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    marginTop: 5,
  },
});

export default CustomTabBar;
