import { Formik as Form } from 'formik';
import React, { useContext, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, SafeAreaView } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import * as Yup from 'yup';
import { colors, globalStyles } from '../../assets/styles';
import { InputComponent, GradientButton } from '../../components';

import AuthContext from '../../contexts/auth';
import { NewUser } from '../../interfaces/user';
import { storageItems } from '../../services/storage';
import { signUp } from '../../services/user';
import { brDateFormatter, enDateFormatter } from '../../utils/formatter';
import { cpfMask } from '../../utils/mask';
import Icons from '../../assets/icons';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Preencha o campo nome'),
  cpf: Yup.string().required('Preencha o campo cpf'),
  birth: Yup.string().required('Preencha o campo data de nascimento'),
  email: Yup.string().email('Digite um e-mail válido').required('Preencha o campo de e-mail'),
  password: Yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres').required('Preencha o campo de senha'),
});

const initialValues: NewUser = {
  name: '',
  email: '',
  cpf: '',
  birth: '',
  password: '',
};

const SignUp: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(AuthContext);

  const { userIcon, emailIcon, cpfIcon, dateIcon, passwordIcon, signUpIcon } = Icons;

  async function handleSubmitForm(values: NewUser) {
    setLoading(true);
    try {
      const { data } = await signUp({
        ...values,
        birth: enDateFormatter(values.birth),
      });
      storageItems(data);

      setUser(data.user);
    } catch (error) {
      showMessage({
        message: error.response.data.error,
        type: 'danger',
        icon: 'danger',
      });
      setLoading(false);
    }
  }
  return (
    <>
      <ScrollView style={styles.scroll}>
        <SafeAreaView style={styles.container}>
          <Text style={styles.title}> Seja bem-vindo</Text>
          <Text style={styles.subTitle}>Informe os dados para realizar o cadastro</Text>

          <Form initialValues={initialValues} onSubmit={handleSubmitForm} validationSchema={validationSchema} validateOnChange={false}>
            {({ values, handleChange, handleSubmit, errors, setFieldTouched, touched, setFieldValue }) => (
              <>
                <View style={globalStyles.inputArea}>
                  <InputComponent
                    value={values.name}
                    label='Nome'
                    onChangeText={handleChange('name')}
                    errors={touched.name && errors.name ? errors.name : ''}
                    onBlur={() => setFieldTouched('name')}
                    icon={userIcon}
                    editable={!loading}
                  />

                  <InputComponent
                    value={values.email}
                    label='Email'
                    keyboardType='email-address'
                    onChangeText={handleChange('email')}
                    errors={touched.email && errors.email ? errors.email : ''}
                    onBlur={() => setFieldTouched('email')}
                    icon={emailIcon}
                    editable={!loading}
                  />

                  <InputComponent
                    value={values.cpf}
                    label='CPF'
                    onChangeText={e => setFieldValue('cpf', cpfMask(e))}
                    keyboardType='numeric'
                    errors={touched.cpf && errors.cpf ? errors.cpf : ''}
                    onBlur={() => setFieldTouched('cpf')}
                    icon={cpfIcon}
                    editable={!loading}
                  />

                  <InputComponent
                    value={values.birth}
                    label='Data de nascimento'
                    errors={touched.birth && errors.birth ? errors.birth : ''}
                    onBlur={() => setFieldTouched('birth')}
                    keyboardType='numeric'
                    onChangeText={e => setFieldValue('birth', brDateFormatter(e))}
                    icon={dateIcon}
                    editable={!loading}
                  />

                  <InputComponent
                    value={values.password}
                    label='Senha'
                    password={true}
                    onChangeText={handleChange('password')}
                    errors={touched.password && errors.password ? errors.password : ''}
                    onBlur={() => setFieldTouched('password')}
                    icon={passwordIcon}
                    editable={!loading}
                  />
                </View>
                <GradientButton loading={loading} onPress={() => handleSubmit()} buttonText='Cadastrar-se' icon={signUpIcon} />
              </>
            )}
          </Form>
        </SafeAreaView>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.screenColor,
    alignItems: 'center',
    padding: 10,
  },
  scroll: {
    flex: 1,
  },
  title: {
    fontSize: 25,
    fontFamily: 'Poppins-SemiBold',
    color: colors.black,
  },
  subTitle: {
    fontFamily: 'Poppins-SemiBold',
    color: colors.black,
  },
});

export default SignUp;
