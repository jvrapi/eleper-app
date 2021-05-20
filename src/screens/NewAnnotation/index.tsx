import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { colors, globalStyles } from '../../assets/styles';
import AuthContext from '../../contexts/auth';
import { UserDisease } from '../../interfaces/user.disease';
import { Save } from '../../interfaces/annotation';
import { getUserDiseases } from '../../services/user.disease';
import { save } from '../../services/annotation';
import { Formik as Form, FormikHelpers } from 'formik';

import NewPostItIcon from '../../assets/icons/new-post-it.svg';
import UserDiseaseIcon from '../../assets/icons/user-disease.svg';
import PostItEdit from '../../assets/icons/post-it-edit.svg';
import PostItSave from '../../assets/icons/post-it-save.svg';
import * as Yup from 'yup';
import { Button, InputButton, ModalComponent, TextArea } from '../../components';

const validationSchema = Yup.object().shape({});

const initialValues: Save = {
  description: '',
  diseaseId: '',
  userId: '',
};

const NewAnnotation: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState<UserDisease[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitForm, setSubmitForm] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showModal, setShowModal] = useState(false);
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
    setSubmitForm(true);
    values.userId = user?.id as string;
    if (!values.diseaseId) {
      delete values.diseaseId;
    }
    try {
      await save(values);
      showMessage({
        message: 'Informações salvas com sucesso!',
        type: 'success',
        icon: 'success',
      });
      resetForm();
      setSelectedDiseaseIndex(null);
    } catch (error) {
      console.log(error.response.data);
      showMessage({
        message: 'Não consegui salvar as informações, pode tentar de novo?',
        type: 'danger',
        icon: 'danger',
      });
    } finally {
      setSubmitForm(false);
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
          <View style={styles.header}>
            <View style={globalStyles.iconContainer}>{<NewPostItIcon fill='#000' width='70' height='70' />}</View>
            <Text style={styles.title}>Nova Anotação</Text>
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
                  <TextArea
                    value={values.description}
                    label='Nome do medicamento que você toma'
                    onChangeText={handleChange('description')}
                    errors={touched.description && errors.description ? errors.description : ''}
                    onBlur={() => setFieldTouched('description')}
                    editable={!submitForm}
                    icon={<PostItEdit fill='#efefef' width='100' height='100' />}
                  />

                  <InputButton
                    label='Para qual doença é essa anotação?'
                    errors={touched.diseaseId && errors.diseaseId ? errors.diseaseId : ''}
                    value={selectedDiseaseIndex === null ? '' : items[selectedDiseaseIndex].disease.name}
                    onBlur={() => setFieldTouched('diseaseId')}
                    disabled={submitForm}
                    onPress={() => setShowModal(true)}
                    icon={<UserDiseaseIcon fill='#000' width='35' height='35' />}
                  />
                </View>

                <Button
                  loading={submitForm}
                  onPress={handleSubmit}
                  buttonText='Salvar'
                  icon={<PostItSave fill='#fff' width='40' height='40' />}
                />

                <ModalComponent showModal={showModal} close={() => setShowModal(false)}>
                  <View style={modalStyles.container}>
                    <Text style={modalStyles.textHeader}>Selecione uma doença</Text>
                    <View style={modalStyles.scrollContainer}>
                      <ScrollView style={modalStyles.scroll}>
                        {items.map((userDisease, i) => (
                          <TouchableWithoutFeedback
                            key={i}
                            onPress={() => {
                              setFieldValue('diseaseId', userDisease.disease.id);
                              selectedDisease(i);
                              setShowModal(false);
                            }}
                          >
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
          </Form>
        </>
      )}
    </SafeAreaView>
  );
};

export default NewAnnotation;

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
