import { RouteProp } from '@react-navigation/core';
import { Formik as Form } from 'formik';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { Keyboard, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Yup from 'yup';
import { buttonIcons } from '../../assets/icons';
import MedicalDateIcon from '../../assets/icons/medical-date.svg';
import MedicineDosageIcon from '../../assets/icons/medicine-dosage.svg';
import MedicineIcon from '../../assets/icons/medicine-icon.svg';
import MedicineInstructionIcon from '../../assets/icons/medicine-instructions.svg';
import NewMedicineIcon from '../../assets/icons/new-medicine.svg';
import UserDiseaseIcon from '../../assets/icons/user-disease.svg';
import { colors, globalStyles } from '../../assets/styles';
import { Button, ErrorComponent, InputButton, InputComponent, LoadingComponent } from '../../components';
import BottomTabBarContext from '../../contexts/bottomTabBar';
import { UserMedicineDetails } from '../../interfaces/user.medicine';
import { getById, update } from '../../services/user.medicine';
import { DateTimeToBrDate } from '../../utils/function';

type RootStackParamList = {
	MedicineDetails: { id: string };
};

type UserMedicineDetailsScreenRouteProp = RouteProp<RootStackParamList, 'MedicineDetails'>;

type Props = {
	route: UserMedicineDetailsScreenRouteProp;
};

const initialValues: UserMedicineDetails = {
	id: '',
	amount: '',
	instruction: '',
	beginDate: '',
	endDate: '',
	userDiseaseId: '',
	medicine: {
		id: '',
		name: '',
	},
	disease: {
		id: '',
		name: '',
	},
};

const validationSchema = Yup.object().shape({
	amount: Yup.string().required('Informe quantos você toma'),

	instruction: Yup.string().required('Informe quantas vezes você o toma '),

	beginDate: Yup.string()
		.required('Informe quando começou com o medicamento')
		.test('date-validation', 'Data não é valida', date => {
			const dateIsValid = moment(new Date(date as string), 'YYYY-MM-DDThh:mm:ssZ', true).isValid();
			return dateIsValid;
		}),

	endDate: Yup.string()
		.notRequired()
		.nullable()
		.test('date-validation', 'Data não é valida', date => {
			if (date) {
				const dateIsValid = moment(new Date(date as string), 'YYYY-MM-DDThh:mm:ssZ', true).isValid();
				return dateIsValid;
			}
			return true;
		}),

	medicine: Yup.object().shape({
		name: Yup.string().required('Informe o nome do medicamento'),
	}),
});

const UserMedicineDetailsScreen: React.FC<Props> = ({ route }) => {
	const { id } = route.params;
	const { setShowTabBar } = useContext(BottomTabBarContext);

	const { updateIcon } = buttonIcons;
	const [userMedicine, setUserMedicine] = useState<UserMedicineDetails>(initialValues);
	const [loading, setLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const [showBeginDatePicker, setShowBeginDatePicker] = useState(false);
	const [showEndDatePicker, setShowEndDatePicker] = useState(false);
	const [submitLoading, setSubmitLoading] = useState(false);
	const [marginBottom, setMarginBottom] = useState(90);

	const scrollStyles = StyleSheet.create({
		scroll: {
			marginBottom,
		},
	});

	useEffect(() => {
		getData();
	}, []);

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
			setMarginBottom(0);
			setShowTabBar(false);
		});
		const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
			setShowTabBar(true);
			setMarginBottom(90);
		});

		return () => {
			keyboardDidHideListener.remove();
			keyboardDidShowListener.remove();
		};
	}, []);

	async function getData() {
		try {
			const { data } = await getById(id);
			setUserMedicine(data);
		} catch {
			setHasError(true);
			showMessage({
				message: 'Não consegui carregar as informações, pode tentar de novo?',
				type: 'danger',
				icon: 'danger',
			});
		} finally {
			setLoading(false);
		}
	}

	async function handleSubmitForm(values: UserMedicineDetails) {
		setSubmitLoading(true);
		const updateMedicine = {
			id: values.id,
			amount: values.amount,
			instruction: values.instruction,
			beginDate: values.beginDate,
			endDate: values.endDate,
			userDiseaseId: values.userDiseaseId,
			medicineId: values.medicine.id,
		};
		try {
			const { data } = await update(updateMedicine);
			setUserMedicine(data);
			showMessage({
				message: 'Informações atualizadas com sucesso!',
				type: 'success',
				icon: 'success',
			});
		} catch (error) {
			showMessage({
				message: 'Não consegui atualizar as informações, pode tentar de novo?',
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
				<KeyboardAwareScrollView style={[styles.keyboard, scrollStyles.scroll]}>
					<View style={styles.header}>
						<View style={globalStyles.iconContainer}>{<NewMedicineIcon fill='#000' width='80' height='80' />}</View>
						<Text style={styles.title}>{userMedicine.medicine?.name}</Text>
					</View>
					<Form
						enableReinitialize
						initialValues={userMedicine}
						onSubmit={handleSubmitForm}
						validationSchema={validationSchema}
						validateOnBlur={false}
						validateOnChange={false}
					>
						{({ values, handleChange, handleSubmit, errors, setFieldTouched, touched, setFieldValue }) => (
							<>
								<View style={globalStyles.inputArea}>
									<InputButton
										value={values.medicine?.name}
										label='Nome do medicamento que você toma'
										errors={touched.medicine?.name && errors.medicine?.name ? errors.medicine.name : ''}
										onBlur={() => setFieldTouched('medicine.name')}
										disabled={true}
										icon={<MedicineIcon fill='#000' width='35' height='35' />}
									/>

									<InputComponent
										value={values.amount}
										label='Quantos você toma?'
										onChangeText={handleChange('amount')}
										errors={touched.amount && errors.amount ? errors.amount : ''}
										onBlur={() => setFieldTouched('amount')}
										editable={!submitLoading}
										icon={<MedicineDosageIcon fill='#000' width='35' height='35' />}
									/>

									<InputComponent
										value={values.instruction}
										label='Quantas vezes você toma?'
										onChangeText={handleChange('instruction')}
										errors={touched.instruction && errors.instruction ? errors.instruction : ''}
										onBlur={() => setFieldTouched('instruction')}
										editable={!submitLoading}
										icon={<MedicineInstructionIcon fill='#000' width='35' height='35' />}
									/>

									<InputButton
										label='Quando começou a tomar?'
										errors={touched.beginDate && errors.beginDate ? errors.beginDate : ''}
										value={DateTimeToBrDate(values.beginDate)}
										onBlur={() => setFieldTouched('beginDate')}
										disabled={submitLoading}
										onPress={() => setShowBeginDatePicker(true)}
										icon={<MedicalDateIcon fill='#000' width='35' height='35' />}
									/>

									<InputButton
										label='Quando terminou de tomar?'
										errors={touched.endDate && errors.endDate ? errors.endDate : ''}
										value={DateTimeToBrDate(values.endDate ? values.endDate : '')}
										onBlur={() => setFieldTouched('endDate')}
										disabled={submitLoading}
										onPress={() => setShowEndDatePicker(true)}
										icon={<MedicalDateIcon fill='#000' width='35' height='35' />}
									/>

									<InputButton
										label='Para qual doença é esse medicamento?'
										errors={touched.disease?.id && errors.disease?.id ? errors.disease?.id : ''}
										value={values.disease?.name as string}
										disabled={true}
										icon={<UserDiseaseIcon fill='#000' width='35' height='35' />}
									/>

									<DateTimePickerModal
										isVisible={showBeginDatePicker}
										mode='date'
										onConfirm={date => {
											setShowBeginDatePicker(false);
											setFieldValue('beginDate', date);
										}}
										onCancel={() => setShowBeginDatePicker(false)}
										date={moment(values.beginDate, 'YYYY-MM-DD').toDate()}
									/>

									<DateTimePickerModal
										isVisible={showEndDatePicker}
										mode='date'
										onConfirm={date => {
											setShowEndDatePicker(false);
											setFieldValue('endDate', date);
										}}
										onCancel={() => setShowEndDatePicker(false)}
										date={values.endDate ? moment(values.endDate, 'YYYY-MM-DD').toDate() : new Date()}
									/>
								</View>

								<Button loading={loading} onPress={handleSubmit} buttonText='Atualizar' icon={updateIcon} style={styles.submitLoading} />
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

export default UserMedicineDetailsScreen;

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
		marginTop: 20,
	},
	submitLoading: {
		alignSelf: 'center',
		marginBottom: 20,
	},

	title: {
		fontFamily: 'Poppins-SemiBold',
		fontSize: 20,
		marginTop: 10,
	},
	loading: {
		flex: 1,
	},
});
