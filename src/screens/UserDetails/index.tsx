import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, SafeAreaView, View, Keyboard } from 'react-native';
import { colors, globalStyles } from '../../assets/styles';
import ProfileIcon from '../../assets/icons/profile.svg';
import { UserDetails } from '../../interfaces/user';
import { buttonIcons, inputIcons } from '../../assets/icons';
import { DateTimeToBrDate } from '../../utils/function';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Formik as Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Button, ErrorComponent, InputButton, InputComponent, LoadingComponent, ModalComponent } from '../../components';
import { cpfMask } from '../../utils/mask';
import { showMessage } from 'react-native-flash-message';
import { getDetails, update } from '../../services/user';
import AuthContext from '../../contexts/auth';
import ChangePasswordIcon from '../../assets/icons/change-password.svg';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import BottomTabBarContext from '../../contexts/bottomTabBar';

const initialValues: UserDetails = {
	id: '',
	name: '',
	email: '',
	cpf: '',
	birth: '',
	password: '',
};

const validationSchema = Yup.object().shape({
	name: Yup.string().required('Preencha o campo nome'),
	cpf: Yup.string().required('Preencha o campo cpf'),
	birth: Yup.string()
		.required('Preencha o campo data de nascimento')
		.test('date-validation', 'Data não é valida', date => {
			const dateIsValid = moment(new Date(date as string), 'YYYY-MM-DDThh:mm:ssZ', true).isValid();
			return dateIsValid;
		}),
	email: Yup.string().email('Digite um e-mail válido').required('Preencha o campo de e-mail'),
	// password: Yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres').required('Preencha o campo de senha'),
});

const UserDetailsScreen: React.FC = () => {
	const { user } = useContext(AuthContext);
	const { setShowTabBar } = useContext(BottomTabBarContext);

	const [loading, setLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const [submitLoading, setSubmitLoading] = useState(false);
	const [userDetails, setUserDetails] = useState(initialValues);
	const { updateIcon } = buttonIcons;
	const { userIcon, emailIcon, cpfIcon, dateIcon } = inputIcons;
	const [showDatePicker, setShowDatePicker] = useState(false);

	useEffect(() => {
		getData();
	}, []);

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
			setShowTabBar(false);
		});
		const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
			setShowTabBar(true);
		});

		return () => {
			keyboardDidHideListener.remove();
			keyboardDidShowListener.remove();
		};
	}, []);

	async function getData() {
		try {
			const { data } = await getDetails(user?.id as string);
			setUserDetails(data);
		} catch (error) {
			showMessage({
				message: 'Não consegui carregar essas informações, pode tentar de novo?',
				type: 'danger',
				icon: 'danger',
			});
			setHasError(true);
		} finally {
			setLoading(false);
		}
	}

	async function handleSubmitForm(values: UserDetails, { setFieldValue }: FormikHelpers<UserDetails>) {
		setSubmitLoading(true);
		if (!values.password) {
			delete values.password;
		}
		try {
			const { data } = await update(values);
			setUserDetails(data);
			setFieldValue('password', '');
			showMessage({
				message: 'Informações atualizadas com sucesso',
				icon: 'success',
				type: 'success',
			});
		} catch {
			showMessage({
				message: 'Erro ao atualizar os seus dados',
				icon: 'danger',
				type: 'danger',
			});
		} finally {
			setSubmitLoading(false);
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			{!loading && !hasError && (
				<KeyboardAwareScrollView style={styles.keyboard}>
					<View style={styles.header}>
						<View style={globalStyles.iconContainer}>{<ProfileIcon width='90' height='90' fill='#000' />}</View>
						<Text style={styles.title}>Detalhes da conta</Text>
					</View>
					<Form
						enableReinitialize
						initialValues={userDetails}
						onSubmit={handleSubmitForm}
						validationSchema={validationSchema}
						validateOnChange={false}
					>
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
										editable={!submitLoading}
									/>

									<InputComponent
										value={values.email}
										label='Email'
										keyboardType='email-address'
										onChangeText={handleChange('email')}
										errors={touched.email && errors.email ? errors.email : ''}
										onBlur={() => setFieldTouched('email')}
										icon={emailIcon}
										editable={!submitLoading}
									/>

									<InputComponent
										value={cpfMask(values.cpf)}
										label='CPF'
										onChangeText={e => setFieldValue('cpf', cpfMask(e))}
										keyboardType='numeric'
										errors={touched.cpf && errors.cpf ? errors.cpf : ''}
										onBlur={() => setFieldTouched('cpf')}
										icon={cpfIcon}
										editable={!submitLoading}
									/>

									<InputButton
										label='Data de nascimento'
										errors={touched.birth && errors.birth ? errors.birth : ''}
										value={DateTimeToBrDate(values.birth)}
										onBlur={() => setFieldTouched('birth')}
										icon={dateIcon}
										disabled={submitLoading}
										onPress={() => setShowDatePicker(true)}
									/>

									<InputComponent
										value={values.password}
										label='Senha'
										onChangeText={handleChange('password')}
										errors={touched.password && errors.password ? errors.password : ''}
										onBlur={() => setFieldTouched('password')}
										icon={<ChangePasswordIcon width='40' height='40' fill='#000' />}
										editable={!submitLoading}
										password={true}
									/>
								</View>
								<Button
									loading={submitLoading}
									onPress={() => handleSubmit()}
									buttonText='Atualizar'
									icon={updateIcon}
									style={styles.submitButton}
								/>

								<DateTimePickerModal
									date={moment(values.birth, 'YYYY-MM-DD').toDate()}
									isVisible={showDatePicker}
									mode='date'
									onConfirm={date => {
										setShowDatePicker(false);
										setFieldValue('birth', date);
									}}
									onCancel={() => setShowDatePicker(false)}
								/>
							</>
						)}
					</Form>
				</KeyboardAwareScrollView>
			)}
			{loading && <LoadingComponent style={styles.loading} />}
			{hasError && <ErrorComponent />}
		</SafeAreaView>
	);
};

export default UserDetailsScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
		backgroundColor: colors.screenColor,
	},
	keyboard: {
		flex: 1,
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
		marginTop: 10,
		alignSelf: 'center',
	},
	loading: {
		flex: 1,
	},
});
