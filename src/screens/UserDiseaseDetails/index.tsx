import React, { useEffect, useState } from 'react';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors, globalStyles } from '../../assets/styles';
import { getById, update, deleteUserDisease } from '../../services/user.disease';
import { Button, ErrorComponent, InputButton, LoadingComponent, ModalComponent } from '../../components';
import { showMessage } from 'react-native-flash-message';
import { Details } from '../../interfaces/user.disease';
import { pageIcons, inputIcons, buttonIcons } from '../../assets/icons';
import { Formik as Form } from 'formik';
import * as Yup from 'yup';
import { DateTimeToBrDate } from '../../utils/function';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

type RootStackParamList = {
  ExamDetails: { id: string };
};

type UserDiseaseDetailsScreenRouteProp = RouteProp<RootStackParamList, 'ExamDetails'>;

type Props = {
  route: UserDiseaseDetailsScreenRouteProp;
};

const validationSchema = Yup.object().shape({
  active: Yup.boolean(),
  diagnosisDate: Yup.string()
    .nullable()
    .test('date-validation', 'Data não é valida', date => {
      const dateIsValid = moment(new Date(date as string), 'YYYY-MM-DDThh:mm:ssZ', true).isValid();
      return dateIsValid;
    }),
});

const initialValues = {
  disease: {
    id: '',
    name: '',
  },
  id: '',
  active: false,
  diagnosisDate: '',
};

const UserDiseaseDetails: React.FC<Props> = ({ route }) => {
  const { id } = route.params;
  const navigation = useNavigation();
  const { userDiseaseIcon } = pageIcons;
  const { dateIcon, diseaseActive, diseaseInactive } = inputIcons;
  const { checkIcon, deleteIcon, cancelIcon } = buttonIcons;
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [userDisease, setUserDisease] = useState<Details>(initialValues);
  useEffect(() => {
    getData();
  }, []);
  async function getData() {
    try {
      const { data } = await getById(id);
      setUserDisease(data);
    } catch {
      showMessage({
        message: 'Não consegui recuperar as informações, pode tentar de novo?',
        type: 'danger',
        icon: 'danger',
      });
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitForm(values: Details) {
    setSubmitLoading(true);
    try {
      const { data } = await update(values);
      setUserDisease(data);
      showMessage({
        message: 'Informações atualizadas',
        type: 'success',
        icon: 'success',
      });
    } catch (err) {
      showMessage({
        message: 'Não consegui atualizar as informações, pode tentar de novo?',
        type: 'danger',
        icon: 'danger',
      });
    } finally {
      setSubmitLoading(false);
    }
  }

  async function onPressYesButton() {
    setLoading(true);
    setShowModal(false);
    try {
      await deleteUserDisease(id);
      showMessage({
        message: 'Doença excluída com sucesso',
        type: 'success',
        icon: 'success',
      });
      navigation.reset({ routes: [{ name: 'Disease' }] });
    } catch {
      showMessage({
        message: 'Não consegui excluir, pode tentar de novo?',
        type: 'danger',
        icon: 'danger',
      });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {!loading && !hasError && (
        <>
          <View style={styles.header}>
            <View style={globalStyles.iconContainer}>{userDiseaseIcon}</View>
            <Text style={styles.title}>{userDisease.disease.name}</Text>
          </View>

          <Form
            enableReinitialize
            initialValues={userDisease}
            onSubmit={handleSubmitForm}
            validationSchema={validationSchema}
            validateOnChange={false}
          >
            {({ values, handleSubmit, errors, setFieldTouched, touched, setFieldValue }) => (
              <>
                <View style={globalStyles.inputArea}>
                  <InputButton
                    label='Data do diagnotico'
                    errors={touched.diagnosisDate && errors.diagnosisDate ? errors.diagnosisDate : ''}
                    value={DateTimeToBrDate(values.diagnosisDate)}
                    onBlur={() => setFieldTouched('diagnosisDate')}
                    icon={dateIcon}
                    disabled={submitLoading}
                    onPress={() => setShowDatePicker(true)}
                  />

                  <InputButton
                    label='Doença Ativa'
                    errors={touched.active && errors.active ? errors.active : ''}
                    value={`Atualmente ${values.active ? 'ativa' : 'inativa'}`}
                    onBlur={() => setFieldTouched('active')}
                    disabled={submitLoading}
                    icon={values.active ? diseaseActive : diseaseInactive}
                    onPress={() => setFieldValue('active', !values.active)}
                  />
                </View>
                <Button
                  loading={submitLoading}
                  onPress={() => handleSubmit()}
                  buttonText='Atualizar'
                  style={styles.submitButton}
                  icon={checkIcon}
                />
                <Button
                  loading={submitLoading}
                  onPress={() => setShowModal(true)}
                  buttonText='Excluir'
                  style={styles.deleteButton}
                  icon={deleteIcon}
                  colorType='danger'
                />

                <DateTimePickerModal
                  isVisible={showDatePicker}
                  mode='date'
                  onConfirm={date => {
                    setShowDatePicker(false);
                    setFieldValue('diagnosisDate', date);
                  }}
                  onCancel={() => setShowDatePicker(false)}
                />
              </>
            )}
          </Form>
          <ModalComponent showModal={showModal} close={() => setShowModal(false)}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeaderText}>Atenção!</Text>
              <Text style={styles.modalBodyText}>Quer realmente excluir essa doença?</Text>
              <View style={styles.modalButtonsContainer}>
                <Button
                  loading={loading}
                  onPress={onPressYesButton}
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
export default UserDiseaseDetails;
