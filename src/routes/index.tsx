import React, { useContext } from 'react';
import AuthContext from '../contexts/auth';

import AuthRoutes from '../routes/auth.routes';
import AppRoutes from '../routes/app.routes';
import { LoadingComponent } from '../components';
import { SafeAreaView } from 'react-native';

const Routes: React.FC = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    return <LoadingComponent />;
  }

  return user ? (
    <SafeAreaView>
      <AppRoutes />
    </SafeAreaView>
  ) : (
    <AuthRoutes />
  );
};

export default Routes;
