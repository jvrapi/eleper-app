import { RouteProp } from '@react-navigation/core';
import React, { useContext, useEffect, useState } from 'react';
import { buttonIcons } from '../../assets/icons';
import { Update } from '../../interfaces/user.surgery';
import * as Yup from 'yup';
import moment from 'moment';
import { getById, update } from '../../services/user.surgery';
import { showMessage } from 'react-native-flash-message';
import BottomTabBarContext from '../../contexts/bottomTabBar';
import { Keyboard, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import HospitalizationDateIcon from '../../assets/icons/hospital-date.svg';
import HospitalizationIcon from '../../assets/icons/hospitalization.svg';
import MedicalToolsIcon from '../../assets/icons/medical-tools.svg';
import StethoscopeIcon from '../../assets/icons/stethoscope.svg';
import SurgeryAfterEffectsIcon from '../../assets/icons/surgery-after-effects.svg';
import UserSurgeryIcons from '../../assets/icons/user-surgery.svg';
import { Button, ErrorComponent, InputButton, InputComponent, LoadingComponent } from '../../components';
import { colors, globalStyles } from '../../assets/styles';

import { Formik as Form } from 'formik';
import { DateTimeToBrDate } from '../../utils/function';

type RootStackParamList = {
	UserSurgeryDetails: { id: string };
};

type UserSurgeryDetailsScreenRouteProp = RouteProp<RootStackParamList, 'UserSurgeryDetails'>;

type Props = {
	route: UserSurgeryDetailsScreenRouteProp;
};

const initialValues: Update = {
	id: '',
	userId: '',
	hospitalization: {
		entranceDate: '',
		exitDate: '',
		location: '',
		reason: '',
	},
	afterEffects: '',
	surgery: { id: '', name: '' },
};

const validationSchema = Yup.object().shape({
	surgery: Yup.object().shape({
		name: Yup.string().required('informe o nome da cirurgia realizada'),
	}),
	hospitalization: Yup.object().shape({
		entranceDate: Yup.string()
			.test('date-validation', 'Data não é valida', date => {
				const dateIsValid = moment(moment(date).toDate(), 'YYYY-MM-DDThh:mm:ssZ', true).isValid();
				return dateIsValid;
			})
			.required('Informe a data de entrada'),

		location: Yup.string().required('Informe aonde aconteceu a internação'),
		reason: Yup.string().required('Informe o motivo da internação'),
	}),
	afterEffects: Yup.string().nullable(),
});

const UserSurgeryDetails: React.FC<Props> = ({ route }) => {
	const { id } = route.params;
	const { updateIcon } = buttonIcons;
	const { setShowTabBar } = useContext(BottomTabBarContext);
	const [userSurgery, setUserSurgery] = useState(initialValues);
	const [loading, setLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const [showEntranceDatePicker, setShowEntranceDatePicker] = useState(false);
	const [showExitDatePicker, setShowExitDatePicker] = useState(false);
	const [submitLoading, setSubmitLoading] = useState(false);

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
			const { data } = await getById(id);
			setUserSurgery(data);
		} catch (error) {
			showMessage({
				message: 'Erro ao tentar buscar as informações',
				type: 'danger',
				icon: 'danger',
			});
			setHasError(true);
		} finally {
			setLoading(false);
		}
	}

	async function handleSubmitForm(values: Update) {
		setSubmitLoading(true);
		try {
			const { data } = await update(values);
			setUserSurgery(data);
			showMessage({
				message: 'Informações salvas com sucesso!',
				type: 'success',
				icon: 'success',
			});
		} catch {
			showMessage({
				message: 'Erro ao tentar salvar as informações, pode tentar de novo?',
				type: 'danger',
				icon: 'danger',
			});
		} finally {
			setSubmitLoading(false);
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			{!loading && !hasError && (
				<>
					<View style={styles.header}>
						<View style={globalStyles.iconContainer}>{<UserSurgeryIcons fill='#000' width='80' height='80' />}</View>
						<Text style={styles.title}>Detalhes cirurgia</Text>
					</View>
					<Form
						enableReinitialize
						initialValues={userSurgery}
						onSubmit={handleSubmitForm}
						validationSchema={validationSchema}
						validateOnChange={false}
						validateOnBlur={false}
					>
						{({ values, handleChange, handleSubmit, errors, setFieldTouched, touched, setFieldValue }) => (
							<KeyboardAwareScrollView style={styles.keyboard}>
								<View style={globalStyles.inputArea}>
									<InputButton
										value={values.surgery.name}
										label='Qual a cigurgia que você realizou?'
										disabled={true}
										icon={<MedicalToolsIcon fill='#000' width='40' height='40' />}
									/>
									<InputComponent
										value={values.hospitalization.location}
										label='Aonde aconteceu a cirurgia?'
										onChangeText={handleChange('hospitalization.location')}
										errors={touched.hospitalization?.location && errors.hospitalization?.location ? errors.hospitalization.location : ''}
										onBlur={() => setFieldTouched('hospitalization.reason')}
										editable={!submitLoading}
										icon={<HospitalizationIcon fill='#000' width='35' height='35' />}
									/>
									<InputComponent
										value={values.hospitalization.reason}
										label='Qual o motivo da cirurgia?'
										onChangeText={handleChange('hospitalization.reason')}
										errors={touched.hospitalization?.reason && errors.hospitalization?.reason ? errors.hospitalization.reason : ''}
										onBlur={() => setFieldTouched('hospitalization.reason')}
										editable={!submitLoading}
										icon={<StethoscopeIcon fill='#000' width='40' height='40' />}
									/>

									<InputButton
										label='Quando foi realizada a cirurgia?'
										errors={
											touched.hospitalization?.entranceDate && errors.hospitalization?.entranceDate
												? errors.hospitalization.entranceDate
												: ''
										}
										value={DateTimeToBrDate(values.hospitalization.entranceDate)}
										onBlur={() => setFieldTouched('.hospitalization.entranceDate')}
										disabled={submitLoading}
										onPress={() => setShowEntranceDatePicker(true)}
										icon={<HospitalizationDateIcon fill='#000' width='40' height='40' />}
									/>

									<InputButton
										label='Quando você teve alta hospitalar?'
										errors={touched.hospitalization?.exitDate && errors.hospitalization?.exitDate ? errors.hospitalization.exitDate : ''}
										value={DateTimeToBrDate(values.hospitalization.exitDate ? values.hospitalization.exitDate : '')}
										onBlur={() => setFieldTouched('hospitalization.exitDate')}
										disabled={submitLoading}
										onPress={() => setShowExitDatePicker(true)}
										icon={<HospitalizationDateIcon fill='#000' width='40' height='40' />}
									/>

									<InputComponent
										value={values.afterEffects}
										label='Teve alguma sequela?'
										onChangeText={handleChange('afterEffects')}
										errors={touched.afterEffects && errors.afterEffects ? errors.afterEffects : ''}
										onBlur={() => setFieldTouched('afterEffects')}
										editable={!submitLoading}
										icon={<SurgeryAfterEffectsIcon fill='#000' width='40' height='40' />}
									/>

									<DateTimePickerModal
										isVisible={showEntranceDatePicker}
										mode='date'
										onConfirm={date => {
											setShowEntranceDatePicker(false);
											setFieldValue('hospitalization.entranceDate', date);
										}}
										onCancel={() => setShowEntranceDatePicker(false)}
									/>

									<DateTimePickerModal
										isVisible={showExitDatePicker}
										mode='date'
										onConfirm={date => {
											setShowExitDatePicker(false);
											setFieldValue('hospitalization.exitDate', date);
										}}
										onCancel={() => setShowExitDatePicker(false)}
									/>
								</View>
								<Button
									loading={submitLoading}
									onPress={handleSubmit}
									buttonText='Atualizar'
									style={styles.submitLoading}
									icon={updateIcon}
								/>
							</KeyboardAwareScrollView>
						)}
					</Form>
				</>
			)}
			{loading && <LoadingComponent style={styles.loading} />}
			{hasError && <ErrorComponent />}
		</SafeAreaView>
	);
};

export default UserSurgeryDetails;

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
	scroll: {
		backgroundColor: 'red',
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
	scrollContainer: {
		width: '100%',
	},
	submitLoading: {
		alignSelf: 'center',
	},
	loading: {
		flex: 1,
	},
});
