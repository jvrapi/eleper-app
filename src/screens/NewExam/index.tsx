import React, { useContext, useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors, globalStyles } from '../../assets/styles';
import { pageIcons, inputIcons, buttonIcons } from '../../assets/icons';
import { Exam } from '../../interfaces/exam';
import * as Yup from 'yup';
import { Formik as Form, FormikHelpers } from 'formik';
import { Button, InputComponent, PickFile } from '../../components';
import mime from 'mime';
import { showMessage } from 'react-native-flash-message';
import { FileProps } from '../../components/PickFile';
import { save } from '../../services/exam';
import AuthContext from '../../contexts/auth';

const initialValues: Exam = {
  id: '',
  name: '',
  userId: '',
  createdAt: '',
  path: '',
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Preencha este campo'),
  path: Yup.string().required('Escolha um arquivo'),
});

const NewExam = () => {
  const { user } = useContext(AuthContext);
  const { newExamIcon } = pageIcons;
  const { nameIcon } = inputIcons;
  const { terminatedEditExamIcon } = buttonIcons;
  const [fileProps, setFileProps] = useState<FileProps>({} as FileProps);
  const [loading, setLoading] = useState(false);

  async function handleSubmitForm(values: Exam, { resetForm }: FormikHelpers<Exam>) {
    const multiFormData = new FormData();

    const pdfFile = {
      uri: Platform.OS === 'android' ? fileProps.uri : fileProps.uri.replace('file:/', ''),
      type: mime.getType(fileProps.uri + '/' + fileProps.name),
      name: values.name + '.pdf',
    };

    multiFormData.append('exam', pdfFile);

    multiFormData.append('name', values.name);

    multiFormData.append('userId', user?.id);

    setLoading(true);
    try {
      await save(multiFormData);
      showMessage({
        message: 'Exame atualizado com sucesso',
        type: 'success',
        icon: 'success',
      });
      resetForm();
    } catch (err) {
      showMessage({
        message: 'Não consegui salvar o exame. Pode tentar de novo?',
        type: 'danger',
        icon: 'danger',
      });
    } finally {
      setLoading(false);
    }
    return;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={globalStyles.iconContainer}>{newExamIcon}</View>
        <Text style={styles.title}>Novo Exame</Text>
      </View>
      <Form initialValues={initialValues} onSubmit={handleSubmitForm} validationSchema={validationSchema} validateOnChange={false}>
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
                editable={loading}
              />
            </View>

            <PickFile
              onFileSelected={fileProps => {
                setFieldValue('path', fileProps.name);
                setFileProps(fileProps);
              }}
              fileName={values.path}
              errors={touched.path && errors.path ? errors.path : ''}
              onBlur={() => setFieldTouched('path')}
              disabled={loading}
            />

            <Button
              loading={loading}
              onPress={handleSubmit}
              buttonText='Salvar'
              style={styles.submitButton}
              icon={terminatedEditExamIcon}
            />
          </>
        )}
      </Form>
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
});

export default NewExam;
