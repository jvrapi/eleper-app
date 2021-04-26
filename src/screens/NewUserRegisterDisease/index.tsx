import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { colors } from '../../assets/styles';
import { ErrorComponent, GradientButton, InputComponent, LoadingComponent, ModalComponent, MultiSelect } from '../../components';
import { MultiSelectItems } from '../../components/MultiSelect';
import { getAll, save } from '../../services/disease';
import Icons from '../../assets/icons';
import { Formik as Form } from 'formik';
import * as Yup from 'yup';
import { Disease, DiseaseSave } from '../../interfaces/disease';

const initialValues = {
  name: '',
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Preencha este campo'),
});

const NewUserRegisterDisease = () => {
  const [items, setItems] = useState<MultiSelectItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [savingDisease, setSavingDisease] = useState(false);
  const { checkIcon, diseaseIcon } = Icons;

  async function getDiseases() {
    try {
      const { data } = await getAll();
      const formattedData = data.map(disease => ({ ...disease, selected: false }));
      setItems(formattedData);
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

  function onSelectedItem(itemId: string) {
    const arrayFormatted = items.map(item => {
      if (item.id === itemId) {
        item.selected = !item.selected;
      }
      return item;
    });

    setItems(arrayFormatted);
  }

  function registerDiseasesTerminated() {
    const itemsSelected = items.filter(item => item.selected);
  }

  function changeModalVisibility() {
    setShowModal(!showModal);
  }

  async function handleSubmitForm(formValues: DiseaseSave) {
    setSavingDisease(true);
    try {
      await save(formValues);
      setShowModal(false);
      await getDiseases();
      showMessage({
        message: 'Obrigado! Acrescentamos essa doença no nossos registros',
        type: 'success',
        icon: 'success',
      });
    } catch (error) {
      setSavingDisease(false);

      showMessage({
        message: error.response.data.error,
        type: 'danger',
        icon: 'danger',
      });
    }
  }

  useEffect(() => {
    getDiseases();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {!loading && !hasError && (
        <View style={styles.container}>
          <Text style={styles.title}>Vamos começar</Text>
          <Text style={styles.subTitle}>
            Me informe alguma doença que você ja teve ou tem.
            {'\n'}
            Você pode escolher mais de uma
          </Text>
          <View style={styles.scroll}>
            <MultiSelect listItems={items} inputLabelText='Toque aqui para listar as doenças' onSelectedItem={onSelectedItem} />
          </View>
          <View style={styles.gradientButton}>
            <GradientButton buttonText='Finalizei!' icon={checkIcon} onPress={registerDiseasesTerminated} />
          </View>
          <TouchableOpacity>
            <Text style={styles.diseaseNotFoundButtonText} onPress={() => setShowModal(true)}>
              Não encontrei a doença
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {loading && <LoadingComponent />}
      {hasError && <ErrorComponent />}
      {showModal && (
        <ModalComponent showModal={showModal} close={changeModalVisibility}>
          <View style={styles.modalBody}>
            <Text style={styles.text}>
              Nos ajude a melhorar! {'\n'} Informe qual doença você não encontrou e eu a cadastrarei no meu banco de dados
            </Text>
            <Form initialValues={initialValues} onSubmit={handleSubmitForm} validationSchema={validationSchema} validateOnChange={false}>
              {({ values, handleChange, handleSubmit, errors, setFieldTouched, touched }) => (
                <>
                  <InputComponent
                    label='Digite o nome da doença'
                    icon={diseaseIcon}
                    value={values.name}
                    onChangeText={handleChange('name')}
                    errors={touched.name && errors.name ? errors.name : ''}
                    onBlur={() => setFieldTouched('name')}
                    editable={!savingDisease}
                  />
                  <GradientButton buttonText='Finalizado' icon={checkIcon} loading={savingDisease} onPress={() => handleSubmit()} />
                </>
              )}
            </Form>
          </View>
        </ModalComponent>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.screenColor,
    width: '100%',
  },

  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
  },
  subTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    width: 300,
    textAlign: 'center',
    marginTop: 20,
  },
  scroll: {
    height: 400,
    width: '95%',
    marginVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diseaseNotFoundButtonText: {
    fontSize: 17,
    color: colors.blue,
    fontFamily: 'Poppins-SemiBold',
  },
  gradientButton: {
    marginBottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  modalBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 50,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
});

export default NewUserRegisterDisease;
