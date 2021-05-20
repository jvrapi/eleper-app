import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { colors, globalStyles } from '../../assets/styles';
import { Formik as Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Button, InputButton, InputComponent, ModalComponent, ErrorComponent, LoadingComponent } from '../../components';
import { DateTimeToBrDate } from '../../utils/function';
import { Save } from '../../interfaces/user.medicine';
import { UserDisease } from '../../interfaces/user.disease';
import { getUserDiseases } from '../../services/user.disease';
import { saveMany } from '../../services/user.medicine';
import AuthContext from '../../contexts/auth';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { showMessage } from 'react-native-flash-message';
import MedicineIcon from '../../assets/icons/medicine-icon.svg';
import MedicineDosageIcon from '../../assets/icons/medicine-dosage.svg';
import MedicineInstructionIcon from '../../assets/icons/medicine-instructions.svg';
import UserDiseaseIcon from '../../assets/icons/user-disease.svg';
import MedicalDateIcon from '../../assets/icons/medical-date.svg';
import NewMedicineIcon from '../../assets/icons/new-medicine.svg';
import NewMedicinePlusIcon from '../../assets/icons/medicine-plus.svg';
import moment from 'moment';

const initialValues: Save = {
  amount: '',
  instruction: '',
  beginDate: '',
  endDate: '',
  userId: '',
  diseaseId: '',
  medicine: {
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
    .test('date-validation', 'Data não é valida', date => {
      if (date) {
        const dateIsValid = moment(new Date(date as string), 'YYYY-MM-DDThh:mm:ssZ', true).isValid();
        return dateIsValid;
      }
      return true;
    }),
  diseaseId: Yup.string().required('Informe para qual doença você o toma'),

  medicine: Yup.object().shape({
    name: Yup.string().required('Informe o nome do medicamento'),
  }),
});

const NewUserMedicine: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [showBeginDatePicker, setShowBeginDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState<UserDisease[]>([]);
  const [selectedDiseaseIndex, setSelectedDiseaseIndex] = useState<number | null>(null);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const { data } = await getUserDiseases(user?.id as string);
      setItems(data);
    } catch {
      showMessage({
        message: 'Ops! Aconteceu alguma coisa',
        type: 'danger',
        icon: 'danger',
      });
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitForm(values: Save, { resetForm }: FormikHelpers<Save>) {
    setLoading(true);
    const data = {
      ...values,
      diseaseId: items[selectedDiseaseIndex as number].disease.id,
      userId: user?.id as string,
      endDate: values.endDate ? values.endDate : null,
    };
    try {
      await saveMany([data]);
      showMessage({
        message: 'Informações salvas com sucesso!',
        type: 'success',
        icon: 'success',
      });
      resetForm();
      setSelectedDiseaseIndex(null);
    } catch (error) {
      showMessage({
        message: 'Não consegui salvar as informações, pode tentar de novo?',
        type: 'danger',
        icon: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }

  function selectedDisease(diseaseArrayIndex: number) {
    setSelectedDiseaseIndex(diseaseArrayIndex);
    setShowModal(false);
  }
  return (
    <SafeAreaView style={styles.container}>
      {!loading && !hasError && (
        <>
          <ScrollView>
            <View style={styles.header}>
              <View style={globalStyles.iconContainer}>{<NewMedicineIcon fill='#000' width='80' height='80' />}</View>
              <Text style={styles.title}>Novo Medicamento</Text>
            </View>
            <Form
              enableReinitialize
              initialValues={initialValues}
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
                      errors={touched.diseaseId && errors.diseaseId ? errors.diseaseId : ''}
                      value={selectedDiseaseIndex === null ? '' : items[selectedDiseaseIndex].disease.name}
                      onBlur={() => setFieldTouched('diseaseId')}
                      disabled={loading}
                      onPress={() => setShowModal(true)}
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
                    />

                    <DateTimePickerModal
                      isVisible={showEndDatePicker}
                      mode='date'
                      onConfirm={date => {
                        setShowEndDatePicker(false);
                        setFieldValue('endDate', date);
                      }}
                      onCancel={() => setShowEndDatePicker(false)}
                    />
                  </View>

                  <Button
                    loading={loading}
                    onPress={async () => {
                      if (selectedDiseaseIndex !== null) {
                        await setFieldValue('diseaseId', items[selectedDiseaseIndex as number].disease.id);
                        setTimeout(() => setFieldTouched('diseaseId', true));
                      }
                      handleSubmit();
                    }}
                    buttonText='Salvar'
                    style={styles.submitButton}
                    icon={<NewMedicinePlusIcon fill='#fff' width='40' height='40' />}
                  />
                </>
              )}
            </Form>
          </ScrollView>
          <ModalComponent showModal={showModal} close={() => setShowModal(false)}>
            <View style={modalStyles.container}>
              <Text style={modalStyles.textHeader}>Selecione uma doença</Text>
              <View style={modalStyles.scrollContainer}>
                <ScrollView style={modalStyles.scroll}>
                  {items.map((userDisease, i) => (
                    <TouchableWithoutFeedback key={i} onPress={() => selectedDisease(i)}>
                      <View style={[modalStyles.content, modalStyles.shadow]}>
                        <Text style={modalStyles.text}> {userDisease.disease.name}</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  ))}
                </ScrollView>
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
  scrollContainer: {
    width: '100%',
  },
  submitButton: {
    alignSelf: 'center',
  },
});

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textHeader: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
  },

  scrollContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 95,
  },

  scroll: {
    width: '100%',
    padding: 10,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d6d6d6',
    marginBottom: 20,
    height: 50,
    borderRadius: 15,
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
  text: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
});

export default NewUserMedicine;
