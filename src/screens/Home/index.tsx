import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { colors } from '../../assets/styles';
import { ErrorComponent, LoadingComponent } from '../../components';
import AuthContext from '../../contexts/auth';
import BottomTabBarContext from '../../contexts/bottomTabBar';
import { getUserDiseases } from '../../services/user.disease';

const Home: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { setShowTabBar } = useContext(BottomTabBarContext);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  async function getData() {
    try {
      const { data } = await getUserDiseases(user?.id as string);
      if (data.length > 0) {
        setShowTabBar(true);
      } else {
        navigation.reset({ routes: [{ name: 'NewUser' }] });
      }
    } catch (error) {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {!loading && (
        <>
          <Text> Home Screen</Text>
        </>
      )}
      {loading && <LoadingComponent />}
      {hasError && <ErrorComponent />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.screenColor,
  },
});

export default Home;
