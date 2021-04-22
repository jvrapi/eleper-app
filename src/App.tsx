import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import 'react-native-gesture-handler';
import { AuthProvider } from './contexts/auth';
import Routes from './routes';
import FlashMessage from 'react-native-flash-message';
import { StyleSheet } from 'react-native';

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Routes />
        <FlashMessage position='top' style={styles.message} duration={3000} />
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
