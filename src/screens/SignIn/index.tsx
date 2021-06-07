import { useNavigation } from '@react-navigation/native';
import { Formik as Form } from 'formik';
import React, { useContext, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import * as Yup from 'yup';
import { colors, globalStyles } from '../../assets/styles';
import { Button, InputComponent } from '../../components';
import AuthContext from '../../contexts/auth';
import { Auth } from '../../interfaces/user';
import { inputIcons, buttonIcons } from '../../assets/icons';

const validationSchema = Yup.object().shape({
	username: Yup.string().email('Digite um e-mail válido').required('Preencha o campo de e-mail'),
	password: Yup.string().min(3, 'A senha deve ter no mínimo 6 caracteres').required('Preencha o campo de senha'),
});

const initialValues: Auth = { username: '', password: '' };

const SignIn: React.FC = () => {
	const { auth } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);
	const navigation = useNavigation();

	const { emailIcon, passwordIcon } = inputIcons;
	const { signInIcon } = buttonIcons;

	async function handleSubmitForm(values: Auth) {
		setLoading(true);
		try {
			await auth(values);
		} catch (err) {
			setLoading(false);
		}
	}
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}> Seja bem-vindo de volta</Text>
				<Text style={styles.subTitle}>Para continuar, informe o seu e-mail e a sua senha</Text>
			</View>
			<Form
				initialValues={initialValues}
				onSubmit={handleSubmitForm}
				validationSchema={validationSchema}
				validateOnChange={false}
				validateOnBlur={false}
			>
				{({ values, handleChange, handleSubmit, errors, setFieldTouched, touched }) => (
					<>
						<View style={globalStyles.inputArea}>
							<InputComponent
								value={values.username}
								label='Email'
								onChangeText={handleChange('username')}
								errors={touched.username && errors.username ? errors.username : ''}
								onBlur={() => setFieldTouched('username')}
								icon={emailIcon}
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
						<Button loading={loading} onPress={() => handleSubmit()} buttonText='Acessar' icon={signInIcon} style={styles.submitButton} />
					</>
				)}
			</Form>

			<TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotPasswordButton}>
				<Text style={styles.forgotPasswordButtonText}>Esqueci minha senha</Text>
			</TouchableOpacity>
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
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 30,
	},
	title: {
		fontFamily: 'Poppins-SemiBold',
		fontSize: 25,
		color: colors.black,
	},
	subTitle: {
		fontFamily: 'Poppins-SemiBold',
		width: 240,
		color: colors.black,
	},
	forgotPasswordButton: {
		marginTop: 30,
	},
	forgotPasswordButtonText: {
		fontSize: 17,
		color: colors.blue,
		fontFamily: 'Poppins-SemiBold',
	},
	submitButton: {
		marginTop: 40,
	},
});

export default SignIn;
