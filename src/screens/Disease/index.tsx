import React, { useContext, useEffect, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { colors } from '../../assets/styles';
import { Card, ErrorComponent, FloatButton, LoadingComponent } from '../../components';
import AuthContext from '../../contexts/auth';
import { UserDisease } from '../../interfaces/user.disease';
import { getUserDiseases } from '../../services/user.disease';
import { DateTimeToBrDate } from '../../utils/function';
import { buttonIcons, pageIcons } from '../../assets/icons';
import { useNavigation } from '@react-navigation/native';

const Disease: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [userDiseases, setUserDiseases] = useState<UserDisease[]>([]);
  const { navigate } = useNavigation();

  async function getData() {
    setLoading(true);
    try {
      const { data } = await getUserDiseases(user?.id as string);
      setUserDiseases(data);
      console.log(data);
    } catch {
      setHasError(true);
      showMessage({
        message: 'Não consegui carregar a lista com as suas doenças',
        type: 'danger',
        icon: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    await getData();
    showMessage({
      message: 'Lista atualizada!',
      type: 'success',
      icon: 'success',
    });
  }

  function onPressFloatButton() {
    navigate('New Disease');
  }

  useEffect(() => {
    getData();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      {!loading && !hasError && (
        <>
          <Text style={styles.title}>Minhas doenças</Text>
          <View style={styles.scrollContainer}>
            <ScrollView style={styles.scroll} refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}>
              {userDiseases.map((userDisease, i) => (
                <Card key={i} style={[styles.card, styles.shadow]}>
                  <View style={styles.textContainer}>
                    <Text style={styles.examName}>{userDisease.disease.name}</Text>
                    <Text style={styles.examDate}>{DateTimeToBrDate(userDisease.diagnosisDate as string)}</Text>
                    <Text>Atualmente {userDisease.active ? 'Ativa' : 'Inativa'}</Text>
                  </View>
                  {pageIcons.diseaseIcon}
                </Card>
              ))}
            </ScrollView>
          </View>
          <FloatButton icon={buttonIcons.newDiseaseIcon} style={styles.floatButton} onPress={onPressFloatButton} />
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.screenColor,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
  },
  scrollContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '72%',
  },
  scroll: {
    width: '100%',
    padding: 10,
  },

  card: {
    marginVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 20,
  },
  shadow: {
    shadowColor: '#2974FA',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },

  textContainer: {
    justifyContent: 'center',
  },
  examName: {
    fontFamily: 'Poppins-Regular',
    fontSize: 17,
  },
  examDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
  },
  floatButton: {
    bottom: 100,
    right: 30,
  },
});

export default Disease;
