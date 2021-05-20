import { RouteProp, useNavigation } from '@react-navigation/native';
import { Formik as Form } from 'formik';
import mime from 'mime';
import React, { useEffect, useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import * as Yup from 'yup';
import { buttonIcons, inputIcons, pageIcons } from '../../assets/icons';
import { colors, globalStyles } from '../../assets/styles';
import { Button, ErrorComponent, InputComponent, LoadingComponent, ModalComponent, PickFile } from '../../components';
import { FileProps } from '../../components/PickFile';
import { Exam } from '../../interfaces/exam';
import { deleteExam, getById, updateExam } from '../../services/exam';

type RootStackParamList = {
  ExamDetails: { id: string };
};

type ExamDetailsScreenRouteProp = RouteProp<RootStackParamList, 'ExamDetails'>;

type Props = {
  route: ExamDetailsScreenRouteProp;
};

const initialValues: Exam = {
  id: '',
  name: '',
  userId: '',
  createdAt: '',
  path: '',
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Preencha este campo'),
});

const ExamDetails: React.FC<Props> = ({ route }) => {
  const { id } = route.params;
  const navigation = useNavigation();
  const [exam, setExam] = useState<Exam>(initialValues);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { nameIcon } = inputIcons;
  const { examDetailsIcon } = pageIcons;
  const { terminatedEditExamIcon, deleteExamIcon, checkIcon, cancelIcon } = buttonIcons;
  const [fileProps, setFileProps] = useState<FileProps>({} as FileProps);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const { data } = await getById(id);
      setExam(data);
    } catch (error) {
      setHasError(true);
      showMessage({
        message: 'Não consegui recuperar as informações do exame',
        type: 'danger',
        icon: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitForm(values: Exam) {
    const pdfFile = {
      uri: Platform.OS === 'android' ? fileProps.uri : fileProps.uri.replace('file:/', ''),
      type: mime.getType(fileProps.uri + '/' + fileProps.name),
      name: values.name + '.pdf',
    };

    const multiFormData = new FormData();

    pdfFile.uri ? multiFormData.append('exam', pdfFile) : null;

    multiFormData.append('name', values.name);

    multiFormData.append('id', values.id);

    setSubmitLoading(true);

    try {
      const { data } = await updateExam(multiFormData);
      setExam(data);
      showMessage({
        message: 'Exame atualizado com sucesso',
        type: 'success',
        icon: 'success',
      });
    } catch (error) {
      showMessage({
        message: 'Não consegui atualizar o exame. Pode tentar de novo?',
        type: 'danger',
        icon: 'danger',
      });
    } finally {
      setSubmitLoading(false);
    }
  }

  async function onPressYesButton() {
    setShowModal(false);
    setLoading(true);
    try {
      await deleteExam(id);
      showMessage({
        message: 'Exame excluído com sucesso',
        type: 'success',
        icon: 'success',
      });
      navigation.reset({ routes: [{ name: 'Exam' }] });
    } catch (error) {
      showMessage({
        message: 'Não consegui excluir esse exame, pode tentar de novo?',
        type: 'danger',
        icon: 'danger',
      });
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {!loading && !hasError && (
        <>
          <View style={styles.header}>
            <View style={globalStyles.iconContainer}>{examDetailsIcon}</View>
            <Text style={styles.title}>Detalhes do Exame</Text>
          </View>
          <Form
            enableReinitialize
            initialValues={exam}
            onSubmit={handleSubmitForm}
            validationSchema={validationSchema}
            validateOnChange={false}
          >
            {({ values, handleChange, handleSubmit, errors, setFieldTouched, touched, setFieldValue }) => (
              <>
                <View style={globalStyles.inputArea}>
                  <InputComponent
                    label='Nome'
                    errors={touched.name && errors.name ? errors.name : ''}
                    value={values.name}
                    onChangeText={handleChange('name')}
                    onBlur={() => setFieldTouched('name')}
                    icon={nameIcon}
                    editable={!submitLoading}
                  />
                </View>
                <PickFile
                  onFileSelected={props => {
                    setFieldValue('path', props.name);
                    setFileProps(props);
                  }}
                  fileName={values.path}
                  errors={touched.path && errors.path ? errors.path : ''}
                  onBlur={() => setFieldTouched('path')}
                  disabled={submitLoading}
                />
                <Button
                  loading={submitLoading}
                  onPress={() => handleSubmit()}
                  buttonText='Atualizar'
                  style={styles.submitButton}
                  icon={terminatedEditExamIcon}
                />
                {/* <Button
                  loading={submitLoading}
                  onPress={() => setShowModal(true)}
                  buttonText='Excluir'
                  style={styles.deleteButton}
                  icon={deleteExamIcon}
                  colorType='danger'
                /> */}
              </>
            )}
          </Form>
          <ModalComponent showModal={showModal} close={() => setShowModal(false)}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeaderText}>Atenção!</Text>
              <Text style={styles.modalBodyText}>Quer realmente excluir esse exame?</Text>
              <View style={styles.modalButtonsContainer}>
                <Button
                  loading={loading}
                  onPress={() => onPressYesButton()}
                  buttonText='Sim'
                  style={[styles.modalButton, styles.firstModalButton]}
                  icon={checkIcon}
                  colorType='danger'
                />

                <Button
                  loading={loading}
                  onPress={() => setShowModal(false)}
                  buttonText='Não'
                  style={styles.modalButton}
                  icon={cancelIcon}
                  colorType='success'
                />
              </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.screenColor,
  },

  header: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    marginTop: 10,
  },

  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
  },

  fileCard: {
    width: '100%',
    backgroundColor: '#fff',
    height: 60,
    flexDirection: 'row',
    borderRadius: 30,
    paddingHorizontal: 15,
    borderColor: '#000000',
    borderStyle: 'solid',
    borderWidth: 2,
    alignItems: 'center',
  },

  fileName: {
    fontFamily: 'Poppins-Regular',
    marginLeft: 10,
  },

  submitButton: {
    marginTop: 20,
  },

  deleteButton: {
    marginTop: 10,
  },

  modalContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  modalHeaderText: {
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    fontSize: 27,
    marginVertical: 20,
    color: colors.danger,
  },

  modalBodyText: {
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    fontSize: 20,
    marginVertical: 20,
  },

  modalButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalButton: {
    width: 170,
  },

  firstModalButton: {
    marginRight: 20,
  },
});
export default ExamDetails;
