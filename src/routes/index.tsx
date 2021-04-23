import React, { useContext } from 'react';
import AuthContext from '../contexts/auth';

import AuthRoutes from '../routes/auth.routes';
import AppRoutes from '../routes/app.routes';
import { LoadingComponent } from '../components';
import { View, StyleSheet } from 'react-native';

const Routes: React.FC = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    return (
      <View style={styles.container}>
        <LoadingComponent />
      </View>
    );
  }

  return user ? <AppRoutes /> : <AuthRoutes />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Routes;
