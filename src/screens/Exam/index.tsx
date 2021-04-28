import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../assets/styles';
import AuthContext from '../../contexts/auth';
import { Exam } from '../../interfaces/exam';
import { getAll } from '../../services/exam';
import { Card, ErrorComponent, LoadingComponent } from '../../components';
import { DateTimeToBrDate } from '../../utils/function';
import { pageIcons } from '../../assets/icons';
import { useNavigation } from '@react-navigation/native';

const ExamScreen = () => {
  const { user } = useContext(AuthContext);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { myExamsIcon } = pageIcons;
  const navigation = useNavigation();

  async function getData() {
    try {
      const { data } = await getAll(user?.id as string);
      setExams(data);
    } catch (error) {
      showMessage({
        message: error.response.data.error,
        type: 'danger',
        icon: 'danger',
      });
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }

  function onRefresh() {
    getData();
  }

  function onPressCard(id: string) {
    navigation.navigate('ExamDetails', { id });
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {!loading && !hasError && (
        <>
          <Text style={styles.title}>Meus exames</Text>
          <ScrollView style={styles.scroll} refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}>
            {exams.map((exam, i) => (
              <Card key={i} style={[styles.card, styles.shadow]} onPress={() => onPressCard(exam.id)}>
                <View style={styles.textContainer}>
                  <Text style={styles.examName}>{exam.name}</Text>
                  <Text style={styles.examDate}>{DateTimeToBrDate(exam.createdAt)}</Text>
                </View>
                {myExamsIcon}
              </Card>
            ))}
          </ScrollView>
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
    backgroundColor: colors.screenColor,
    paddingTop: 70,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
  },
  scrollContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 450,
  },
  scroll: {
    width: '100%',
    height: '50%',
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
    marginLeft: 5,
  },
});

export default ExamScreen;
