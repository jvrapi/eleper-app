import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, StyleSheet, View } from 'react-native';

import { RouteProp } from '@react-navigation/native';
import { ErrorComponent, Button, InputComponent, LoadingComponent } from '../../components';
import { getById } from '../../services/exam';
import { Exam } from '../../interfaces/exam';
import { showMessage } from 'react-native-flash-message';
import { Formik as Form } from 'formik';
import * as Yup from 'yup';
import { colors, globalStyles } from '../../assets/styles';
import { fileNameFormatter } from '../../utils/formatter';
import { pageIcons } from '../../assets/icons';

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
  const [exam, setExam] = useState<Exam>(initialValues);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { myExamsIcon } = pageIcons;

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
        message: error.response.data.error,
        type: 'danger',
        icon: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitForm() {
    return;
  }

  return (
    <SafeAreaView style={styles.container}>
      {!loading && !hasError && (
        <>
          <Form
            enableReinitialize
            initialValues={exam}
            onSubmit={handleSubmitForm}
            validationSchema={validationSchema}
            validateOnChange={false}
          >
            {({ values, handleChange, handleSubmit, errors, setFieldTouched, touched }) => (
              <>
                <View style={globalStyles.inputArea}>
                  <InputComponent
                    label='Nome'
                    errors={touched.name && errors.name ? errors.name : ''}
                    value={values.name}
                    onChangeText={handleChange('name')}
                    onBlur={() => setFieldTouched('name')}
                  />
                </View>
                <View style={styles.fileContainer}>
                  {myExamsIcon}
                  <Text style={styles.fileName}>{fileNameFormatter(exam.path)}</Text>
                </View>
                <Button loading={loading} onPress={() => handleSubmit()} buttonText='Acessar' style={styles.submitButton} />
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
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  fileName: {
    fontFamily: 'Poppins-Regular',
    marginRight: 20,
    marginTop: 10,
  },
  submitButton: {
    marginTop: 40,
  },
});
export default ExamDetails;
