import React from 'react';
import { Formik as Form } from 'formik';
import { Button, InputComponent } from '..';
import { Save } from '../../interfaces/user.medicine';
import * as Yup from 'yup';
import { StyleSheet, View } from 'react-native';
import { inputIcons, buttonIcons } from '../../assets/icons';
import MedicineIcon from '../../assets/icons/medicine-icon.svg';
import MedicineDoseIcon from '../../assets/icons/medicine-dosage.svg';
import MedicineInstructionsIcon from '../../assets/icons/medical-instructions.svg';
import { globalStyles } from '../../assets/styles';

interface Props {
  handleSubmitForm(values?: Save): void;
  loading: boolean;
}

const initialValues = {
  name: '',
  amount: 0,
  instruction: '',
  active: false,
  beginDate: '',
  endDate: '',
};

const validationSchema = Yup.object().shape({});

const NewMedicineForm: React.FC<Props> = ({ handleSubmitForm, loading }) => {
  const { diseaseIcon } = inputIcons;
  const { checkIcon } = buttonIcons;

  return (
    <Form initialValues={initialValues} onSubmit={handleSubmitForm} validationSchema={validationSchema} validateOnChange={false}>
      {({ values, handleChange, handleSubmit, errors, setFieldTouched, touched }) => (
        <>
          <View style={globalStyles.inputArea}>
            <InputComponent
              label='Qual o  medicamento que você toma?'
              icon={<MedicineIcon width={30} height={30} fill='#000' />}
              value={values.name}
              onChangeText={handleChange('name')}
              errors={touched.name && errors.name ? errors.name : ''}
              onBlur={() => setFieldTouched('name')}
              editable={!loading}
            />

            <InputComponent
              label='Quantos você toma?'
              icon={<MedicineDoseIcon width={30} height={30} fill='#000' />}
              value={values.name}
              onChangeText={handleChange('name')}
              errors={touched.name && errors.name ? errors.name : ''}
              onBlur={() => setFieldTouched('name')}
              editable={!loading}
              keyboardType='numeric'
            />

            <InputComponent
              label='Quantas vezes ao dia você toma?'
              icon={<MedicineInstructionsIcon width={30} height={30} fill='#000' />}
              value={values.name}
              onChangeText={handleChange('name')}
              errors={touched.name && errors.name ? errors.name : ''}
              onBlur={() => setFieldTouched('name')}
              editable={!loading}
              keyboardType='numeric'
            />
          </View>
          <View style={styles.Button}>
            <Button buttonText='Registrar doenças' icon={checkIcon} onPress={handleSubmit} />
          </View>
        </>
      )}
    </Form>
  );
};
const styles = StyleSheet.create({
  Button: {
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
});
export default NewMedicineForm;
