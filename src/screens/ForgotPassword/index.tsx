import { useNavigation } from '@react-navigation/native';
import { Formik as Form } from 'formik';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import * as Yup from 'yup';
import { colors } from '../../assets/styles';
import { GradientButton, InputComponent, LoadingComponent } from '../../components';
import { SendMail } from '../../interfaces/email';
import { RedefinePassword } from '../../interfaces/user';
import { redefinePassword, sendRedefineCode } from '../../services/user';
import Icons from '../../assets/icons';

/* initial values */
const initialEmailValue: SendMail = {
  email: '',
};

const initialRedefinePasswordValue: RedefinePassword = {
  email: '',
  code: '',
  password: '',
};

const initialTitlesValues = {
  title: 'Redefinição de senha',
  subTitle: 'Informe o seu email',
};

/* Yup schemas validation */
const validationEmailSchema = Yup.object().shape({
  email: Yup.string().email('Digite um e-mail válido').required('Preencha o campo de e-mail'),
});

const validationRedefinePasswordSchema = Yup.object().shape({
  code: Yup.string().required('Preencha o campo código').min(11).max(11),

  password: Yup.string().required('Preencha o campo senha').min(3),
});

const ForgotPassword: React.FC = () => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(true);
  const [showRedefinePasswordForm, setShowRedefinePasswordForm] = useState(false);
  const [titles, setTitles] = useState(initialTitlesValues);
  const [email, setEmail] = useState('');

  const { container, title, subTitle, notReceivedCode, notReceivedCodeText } = styles(titles.subTitle.length > 20);
  const { emailIcon, passwordIcon, recoveryCodeIcon, redefinePasswordIcon, sendEmailIcon } = Icons;

  const handleSubmitEmailForm = async (values: SendMail) => {
    setLoading(true);

    setShowEmailForm(false);

    setTitles({
      title: 'Aguarde....',
      subTitle: 'Estamos procurando o seu e-mail',
    });

    try {
      await sendRedefineCode(values);

      setShowRedefinePasswordForm(true);

      setTitles({
        title: 'Redefinição de senha',
        subTitle: 'Informe o código e a nova senha',
      });

      setEmail(values.email);

      setLoading(false);
      showMessage({
        message: 'Em alguns instantes, você receberá o código para redefinir a sua senha',
        type: 'success',
        icon: 'success',
      });
    } catch (error) {
      setLoading(false);

      setShowEmailForm(true);

      setTitles(initialTitlesValues);

      showMessage({
        message: error.response.data.error,
        type: 'danger',
        icon: 'danger',
      });
    }
  };

  const reSendCode = async () => {
    setLoading(true);
    try {
      await sendRedefineCode({ email });

      setShowRedefinePasswordForm(true);

      setTitles({
        title: 'Redefinição de senha',
        subTitle: 'Informe o código e a nova senha',
      });

      setLoading(false);
      showMessage({
        message: 'Em alguns instantes, você receberá o código para redefinir a sua senha',
        type: 'success',
        icon: 'success',
      });
    } catch (error) {
      setLoading(false);

      setShowEmailForm(true);

      setTitles(initialTitlesValues);

      showMessage({
        message: error.response.data.error,
        type: 'danger',
        icon: 'danger',
      });
    }
  };

  const handleSubmitRedefinePasswordForm = async (values: RedefinePassword) => {
    setLoading(true);

    try {
      await redefinePassword({ ...values, email });
      showMessage({
        message: 'Senha atualizada com sucesso!',
        type: 'success',
        icon: 'success',
      });
      navigation.reset({ routes: [{ name: 'SignIn' }] });
    } catch (error) {
      if (error.response.data.code) {
        const { emailResponse, password, code } = error.response.data;
        let errorMessage = '';
        emailResponse ? (errorMessage += emailResponse) : (errorMessage += '');
        password ? (errorMessage += password) : (errorMessage += '');
        code ? (errorMessage += code) : (errorMessage += '');
        showMessage({
          message: errorMessage,
          type: 'warning',
          icon: 'warning',
        });
      } else {
        showMessage({
          message: error.response.data.error,
          type: 'danger',
          icon: 'danger',
        });
      }

      setLoading(false);
    }
  };

  return (
    <>
      <View style={container}>
        <Text style={title}> {titles.title}</Text>
        <Text style={subTitle}>{titles.subTitle}</Text>
        {!loading && showEmailForm && (
          <>
            <Form
              initialValues={initialEmailValue}
              onSubmit={handleSubmitEmailForm}
              validationSchema={validationEmailSchema}
              validateOnChange={false}
            >
              {({ values, handleChange, handleSubmit, errors, setFieldTouched, touched }) => (
                <>
                  <View>
                    <InputComponent
                      errors={touched.email && errors.email ? errors.email : ''}
                      label='Email'
                      onChangeText={handleChange('email')}
                      value={values.email}
                      onBlur={() => setFieldTouched('email')}
                      keyboardType='email-address'
                      icon={emailIcon}
                      editable={!loading}
                    />
                  </View>
                  <GradientButton onPress={() => handleSubmit()} buttonText='Pronto' icon={sendEmailIcon} />
                </>
              )}
            </Form>
          </>
        )}
        {showRedefinePasswordForm && (
          <Form
            initialValues={initialRedefinePasswordValue}
            onSubmit={handleSubmitRedefinePasswordForm}
            validationSchema={validationRedefinePasswordSchema}
            validateOnChange={false}
          >
            {({ values, handleChange, handleSubmit, errors, setFieldTouched, touched }) => (
              <>
                <View>
                  <InputComponent
                    errors={touched.code && errors.code ? errors.code : ''}
                    label='Código'
                    onChangeText={handleChange('code')}
                    value={values.code}
                    onBlur={() => setFieldTouched('code')}
                    editable={!loading}
                    icon={recoveryCodeIcon}
                  />

                  <InputComponent
                    errors={touched.password && errors.password ? errors.password : ''}
                    label='Senha'
                    onChangeText={handleChange('password')}
                    value={values.password}
                    onBlur={() => setFieldTouched('password')}
                    password={true}
                    icon={passwordIcon}
                    editable={!loading}
                  />
                </View>
                <GradientButton onPress={() => handleSubmit()} buttonText='RedefinirSenha' loading={loading} icon={redefinePasswordIcon} />

                <TouchableOpacity onPress={reSendCode} style={notReceivedCode}>
                  <Text style={notReceivedCodeText}>Não recebi o código</Text>
                </TouchableOpacity>
              </>
            )}
          </Form>
        )}
        {loading && !showEmailForm && !showRedefinePasswordForm && (
          <>
            <LoadingComponent />
          </>
        )}
      </View>
    </>
  );
};

const styles = (textToLong: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.white,
      padding: 15,
    },
    title: {
      fontFamily: 'Nunito-ExtraBold',
      fontSize: 25,
      color: colors.black,
    },
    subTitle: {
      fontFamily: 'Nunito-ExtraBold',
      fontSize: textToLong ? 15 : 16,
      color: colors.black,
      width: 245,
      marginLeft: textToLong ? 0 : 100,
    },
    notReceivedCode: { marginTop: 30 },
    notReceivedCodeText: { fontSize: 17, color: colors.blue, fontFamily: 'Poppins-SemiBold' },
  });

export default ForgotPassword;
