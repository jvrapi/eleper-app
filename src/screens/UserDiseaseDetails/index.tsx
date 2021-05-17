import React, { useEffect, useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors, globalStyles } from '../../assets/styles';
import { getById, update } from '../../services/user.disease';
import { Button, ErrorComponent, InputButton, LoadingComponent } from '../../components';
import { showMessage } from 'react-native-flash-message';
import { Details } from '../../interfaces/user.disease';
import { pageIcons, inputIcons, buttonIcons } from '../../assets/icons';
import { Formik as Form } from 'formik';
import * as Yup from 'yup';
import { DateTimeToBrDate } from '../../utils/function';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

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
  const { userDiseaseIcon } = pageIcons;
  const { dateIcon, diseaseActive, diseaseInactive } = inputIcons;
  const { checkIcon, deleteIcon } = buttonIcons;
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [userDisease, setUserDisease] = useState<Details>(initialValues);

  async function getData() {
    try {
      const { data } = await getById(id);
      setUserDisease(data);
    } catch {
      showMessage({
        message: 'Não consegui recuperar as informações',
        type: 'danger',
        icon: 'danger',
      });
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

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
                <Button loading={submitLoading} buttonText='Excluir' style={styles.deleteButton} icon={deleteIcon} colorType='danger' />

                {showDatePicker && (
                  <DateTimePicker
                    value={values.diagnosisDate ? new Date(values.diagnosisDate as string) : new Date()}
                    maximumDate={new Date()}
                    display='default'
                    mode='date'
                    is24Hour={true}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      setFieldValue('diagnosisDate', selectedDate);
                    }}
                  />
                )}
              </>
            )}
          </Form>
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
});
export default UserDiseaseDetails;
