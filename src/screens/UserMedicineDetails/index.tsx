import { RouteProp } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, SafeAreaView, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { colors, globalStyles } from '../../assets/styles';
import { UserMedicineDetails } from '../../interfaces/user.medicine';
import { getById, update } from '../../services/user.medicine';
import { Button, InputButton, InputComponent, ErrorComponent, LoadingComponent } from '../../components';
import { Formik as Form } from 'formik';
import { DateTimeToBrDate } from '../../utils/function';
import * as Yup from 'yup';
import MedicineIcon from '../../assets/icons/medicine-icon.svg';
import MedicineDosageIcon from '../../assets/icons/medicine-dosage.svg';
import MedicineInstructionIcon from '../../assets/icons/medicine-instructions.svg';
import UserDiseaseIcon from '../../assets/icons/user-disease.svg';
import MedicalDateIcon from '../../assets/icons/medical-date.svg';
import NewMedicineIcon from '../../assets/icons/new-medicine.svg';
import NewMedicinePlusIcon from '../../assets/icons/medicine-plus.svg';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

type RootStackParamList = {
  MedicineDetails: { id: string };
};

type UserMedicineDetailsScreenRouteProp = RouteProp<RootStackParamList, 'MedicineDetails'>;

type Props = {
  route: UserMedicineDetailsScreenRouteProp;
};

const initialValues = {
  id: '',
  amount: '',
  instruction: '',
  beginDate: '',
  endDate: '',
  userId: '',
  medicine: {
    id: '',
    name: '',
  },
  disease: {
    id: '',
    name: '',
  },
};

const validationSchema = Yup.object().shape({
  amount: Yup.string().required('Informe quantos você toma'),

  instruction: Yup.string().required('Informe quantas vezes você o toma '),

  beginDate: Yup.string()
    .required('Informe quando começou com o medicamento')
    .test('date-validation', 'Data não é valida', date => {
      const dateIsValid = moment(new Date(date as string), 'YYYY-MM-DDThh:mm:ssZ', true).isValid();
      return dateIsValid;
    }),

  endDate: Yup.string()
    .notRequired()
    .nullable()
    .test('date-validation', 'Data não é valida', date => {
      if (date) {
        const dateIsValid = moment(new Date(date as string), 'YYYY-MM-DDThh:mm:ssZ', true).isValid();
        return dateIsValid;
      }
      return true;
    }),

  medicine: Yup.object().shape({
    name: Yup.string().required('Informe o nome do medicamento'),
  }),
});

const UserMedicineDetailsScreen: React.FC<Props> = ({ route }) => {
  const { id } = route.params;
  const [userMedicine, setUserMedicine] = useState<UserMedicineDetails>(initialValues);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showBeginDatePicker, setShowBeginDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const { data } = await getById(id);
      setUserMedicine(data);
    } catch {
      setHasError(true);
      showMessage({
        message: 'Não consegui carregar as informações, pode tentar de novo?',
        type: 'danger',
        icon: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitForm(values: UserMedicineDetails) {
    setLoading(true);
    const updateMedicine = {
      id: values.id,
      amount: values.amount,
      instruction: values.instruction,
      beginDate: values.beginDate,
      endDate: values.endDate,
      userId: values.userId,
      diseaseId: values.disease.id,
      medicineId: values.medicine.id,
    };
    try {
      const { data } = await update(updateMedicine);
      setUserMedicine(data);
      showMessage({
        message: 'Informações atualizadas com sucesso!',
        type: 'success',
        icon: 'success',
      });
    } catch (error) {
      showMessage({
        message: 'Não consegui atualizar as informações, pode tentar de novo?',
        type: 'danger',
        icon: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={globalStyles.iconContainer}>{<NewMedicineIcon fill='#000' width='80' height='80' />}</View>
        <Text style={styles.title}>{userMedicine.medicine?.name}</Text>
      </View>
      <Form
        enableReinitialize
        initialValues={userMedicine}
        onSubmit={handleSubmitForm}
        validationSchema={validationSchema}
        validateOnChange={false}
      >
        {({ values, handleChange, handleSubmit, errors, setFieldTouched, touched, setFieldValue }) => (
          <>
            <View style={globalStyles.inputArea}>
              <InputComponent
                value={values.medicine?.name}
                label='Nome do medicamento que você toma'
                onChangeText={handleChange('medicine.name')}
                errors={touched.medicine?.name && errors.medicine?.name ? errors.medicine.name : ''}
                onBlur={() => setFieldTouched('medicine.name')}
                editable={!loading}
                icon={<MedicineIcon fill='#000' width='35' height='35' />}
              />

              <InputComponent
                value={values.amount}
                label='Quantos você toma?'
                onChangeText={handleChange('amount')}
                errors={touched.amount && errors.amount ? errors.amount : ''}
                onBlur={() => setFieldTouched('amount')}
                editable={!loading}
                icon={<MedicineDosageIcon fill='#000' width='35' height='35' />}
              />

              <InputComponent
                value={values.instruction}
                label='Quantas vezes você toma?'
                onChangeText={handleChange('instruction')}
                errors={touched.instruction && errors.instruction ? errors.instruction : ''}
                onBlur={() => setFieldTouched('instruction')}
                editable={!loading}
                icon={<MedicineInstructionIcon fill='#000' width='35' height='35' />}
              />

              <InputButton
                label='Quando começou a tomar?'
                errors={touched.beginDate && errors.beginDate ? errors.beginDate : ''}
                value={DateTimeToBrDate(values.beginDate)}
                onBlur={() => setFieldTouched('beginDate')}
                disabled={loading}
                onPress={() => setShowBeginDatePicker(true)}
                icon={<MedicalDateIcon fill='#000' width='35' height='35' />}
              />

              <InputButton
                label='Quando terminou de tomar?'
                errors={touched.endDate && errors.endDate ? errors.endDate : ''}
                value={DateTimeToBrDate(values.endDate ? values.endDate : '')}
                onBlur={() => setFieldTouched('endDate')}
                disabled={loading}
                onPress={() => setShowEndDatePicker(true)}
                icon={<MedicalDateIcon fill='#000' width='35' height='35' />}
              />

              <InputButton
                label='Para qual doença é esse medicamento?'
                errors={touched.disease?.id && errors.disease?.id ? errors.disease?.id : ''}
                value={values.disease?.name as string}
                disabled={true}
                icon={<UserDiseaseIcon fill='#000' width='35' height='35' />}
              />

              <DateTimePickerModal
                isVisible={showBeginDatePicker}
                mode='date'
                onConfirm={date => {
                  setShowBeginDatePicker(false);
                  setFieldValue('beginDate', date);
                }}
                onCancel={() => setShowBeginDatePicker(false)}
                date={moment(values.beginDate, 'YYYY-MM-DD').toDate()}
              />

              <DateTimePickerModal
                isVisible={showEndDatePicker}
                mode='date'
                onConfirm={date => {
                  setShowEndDatePicker(false);
                  setFieldValue('endDate', date);
                }}
                onCancel={() => setShowEndDatePicker(false)}
                date={values.endDate ? moment(values.endDate, 'YYYY-MM-DD').toDate() : new Date()}
              />
            </View>

            <Button
              loading={loading}
              onPress={handleSubmit}
              buttonText='Atualizar'
              icon={<NewMedicinePlusIcon fill='#fff' width='40' height='40' />}
            />
          </>
        )}
      </Form>
      {loading && <LoadingComponent />}
      {hasError && <ErrorComponent />}
    </SafeAreaView>
  );
};

export default UserMedicineDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
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
});
