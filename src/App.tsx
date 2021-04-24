import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import 'react-native-gesture-handler';
import { AuthProvider } from './contexts/auth';
import { BottomTabBarProvider } from './contexts/bottomTabBar';
import Routes from './routes';
import FlashMessage from 'react-native-flash-message';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'react-native';
import { colors } from './assets/styles';

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <BottomTabBarProvider>
          <StatusBar barStyle='light-content' backgroundColor={colors.screenColor} />
          <Routes />
          <FlashMessage position='top' style={styles.message} duration={3000} />
        </BottomTabBarProvider>
      </AuthProvider>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  message: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
