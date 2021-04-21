import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import 'react-native-gesture-handler';
import { AuthProvider } from './contexts/auth';
import Routes from './routes';
import FlashMessage from 'react-native-flash-message';

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Routes />
        <FlashMessage position='top' style={{ alignItems: 'center', justifyContent: 'center' }} duration={3000} />
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;
