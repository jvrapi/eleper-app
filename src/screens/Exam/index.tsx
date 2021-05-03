import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Linking } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../assets/styles';
import AuthContext from '../../contexts/auth';
import { Exam } from '../../interfaces/exam';
import { getAll } from '../../services/exam';
import api from '../../services/api';
import { Button, Card, ErrorComponent, LoadingComponent, ModalComponent } from '../../components';
import { DateTimeToBrDate } from '../../utils/function';
import { pageIcons, buttonIcons } from '../../assets/icons';
import { useNavigation } from '@react-navigation/native';

const ExamScreen = () => {
  const { user } = useContext(AuthContext);
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<Exam>({} as Exam);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { myExamsIcon } = pageIcons;
  const { examEditIcon, downloadIcon } = buttonIcons;
  const navigation = useNavigation();

  async function getData() {
    try {
      const { data } = await getAll(user?.id as string);
      setExams(data);
    } catch (error) {
      const errorMessage = error.response.data.error;
      showMessage({
        message: errorMessage ? errorMessage : 'Ocorreu um erro ao tentar listar os exames',
        type: 'danger',
        icon: 'danger',
      });
      setHasError(true);
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

  function onPressCard(exam: Exam) {
    setSelectedExam(exam);
    setShowModal(true);
  }

  function onEditButtonPressed() {
    setShowModal(false);
    navigation.navigate('ExamDetails', { id: selectedExam.id });
  }

  async function onDownloadButtonPressed() {
    setShowModal(false);
    setLoading(true);
    downloadFile();
  }

  async function downloadFile() {
    const serverUrl = api.defaults.baseURL;
    const token = api.defaults.headers.Authorization;
    const url = `${serverUrl}/exam/examFile?id=${selectedExam.id}&authorization=${token}`;
    try {
      await Linking.canOpenURL(url);
      Linking.openURL(url);
      setLoading(false);
    } catch (error) {
      showMessage({
        message: 'Desculpe, não consegui abrir o link para o download',
        icon: 'danger',
        type: 'danger',
      });
    }
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
              <Card key={i} style={[styles.card, styles.shadow]} onPress={() => onPressCard(exam)}>
                <View style={styles.textContainer}>
                  <Text style={styles.examName}>{exam.name}</Text>
                  <Text style={styles.examDate}>{DateTimeToBrDate(exam.createdAt)}</Text>
                </View>
                {myExamsIcon}
              </Card>
            ))}
          </ScrollView>
          <ModalComponent showModal={showModal} close={() => setShowModal(false)}>
            <View style={styles.modalContainer}>
              <Button buttonText='Baixar Exame' icon={downloadIcon} onPress={onDownloadButtonPressed} />
              <Button buttonText='Editar Exame' icon={examEditIcon} style={styles.lastButton} onPress={onEditButtonPressed} />
            </View>
          </ModalComponent>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lastButton: {
    marginTop: 20,
  },
});

export default ExamScreen;
