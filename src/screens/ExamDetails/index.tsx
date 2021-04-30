import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, StyleSheet, View, TouchableOpacity, Platform } from 'react-native';

import { RouteProp } from '@react-navigation/native';
import { ErrorComponent, Button, InputComponent, LoadingComponent } from '../../components';
import { getById, updateExam } from '../../services/exam';
import { Exam } from '../../interfaces/exam';
import { showMessage } from 'react-native-flash-message';
import { Formik as Form } from 'formik';
import * as Yup from 'yup';
import { colors, globalStyles } from '../../assets/styles';
import { inputIcons, pageIcons } from '../../assets/icons';
import DocumentPicker from 'react-native-document-picker';
import mime from 'mime';

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
  const { nameIcon, myExamsIcon } = inputIcons;
  const { examDetailsIcon } = pageIcons;
  const [uriFile, setUriFile] = useState('');

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

  async function pickFile() {
    try {
      const { uri, name } = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      setUriFile(uri);
      setExam({ ...exam, path: name });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        showMessage({
          message: 'Não consegui carregar o arquivo que você escolheu, pode tentar de novo?',
          type: 'danger',
          icon: 'danger',
        });
      } else {
        throw err;
      }
    }
  }

  async function handleSubmitForm(values: Exam) {
    const multiFormData = new FormData();

    const newImageUri = 'file:///' + uriFile.split('file:/').join('');

    const pdfFile = {
      uri: Platform.OS === 'android' ? uriFile : uriFile.replace('file:/', ''),
      type: mime.getType(newImageUri),
      name: values.name + '.pdf',
    };

    multiFormData.append('exam', pdfFile);

    multiFormData.append('name', values.name);
    multiFormData.append('id', values.id);
    setLoading(true);
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
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {!loading && !hasError && (
        <>
          <View style={styles.header}>
            {examDetailsIcon}
            <Text style={styles.title}>Detalhes do Exame</Text>
          </View>
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
                    icon={nameIcon}
                  />
                </View>
                <View style={styles.fileContainer}>
                  <TouchableOpacity style={styles.fileCard} onPress={pickFile} activeOpacity={0.5}>
                    {myExamsIcon}
                    <Text style={styles.fileName}>{exam.path}</Text>
                  </TouchableOpacity>
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
    marginTop: 40,
  },
});
export default ExamDetails;
