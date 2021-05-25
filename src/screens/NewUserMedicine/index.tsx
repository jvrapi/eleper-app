import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { colors, globalStyles } from '../../assets/styles';
import { Formik as Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Button, InputButton, InputComponent, ModalComponent, ErrorComponent, LoadingComponent } from '../../components';
import { DateTimeToBrDate } from '../../utils/function';
import { Save } from '../../interfaces/user.medicine';
import { UserDisease } from '../../interfaces/user.disease';
import * as DiseaseService from '../../services/user.disease';
import * as MedicineService from '../../services/medicine';
import { saveMany } from '../../services/user.medicine';
import AuthContext from '../../contexts/auth';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { showMessage } from 'react-native-flash-message';
import MedicineIcon from '../../assets/icons/medicine-icon.svg';
import MedicineDosageIcon from '../../assets/icons/medicine-dosage.svg';
import MedicineInstructionIcon from '../../assets/icons/medicine-instructions.svg';
import UserDiseaseIcon from '../../assets/icons/user-disease.svg';
import MedicalDateIcon from '../../assets/icons/medical-date.svg';
import NewMedicineIcon from '../../assets/icons/new-medicine.svg';
import moment from 'moment';
import { buttonIcons, pageIcons } from '../../assets/icons';
import { Medicine } from '../../interfaces/medicine';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import BottomTabBarContext from '../../contexts/bottomTabBar';

const initialValues: Save = {
	amount: '',
	instruction: '',
	beginDate: '',
	endDate: '',
	userId: '',
	userDiseaseId: '',
	medicineId: '',
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
		.test('date-validation', 'Data não é valida', date => {
			if (date) {
				const dateIsValid = moment(new Date(date as string), 'YYYY-MM-DDThh:mm:ssZ', true).isValid();
				return dateIsValid;
			}
			return true;
		}),
	userDiseaseId: Yup.string().required('Informe para qual doença você o toma'),

	medicineId: Yup.string().required('Informe o nome do medicamento'),
});

const NewUserMedicine: React.FC = () => {
	const { user } = useContext(AuthContext);
	const { setShowTabBar } = useContext(BottomTabBarContext);

	const { addIcon } = buttonIcons;
	const { searchIcon } = pageIcons;
	const [showBeginDatePicker, setShowBeginDatePicker] = useState(false);
	const [showEndDatePicker, setShowEndDatePicker] = useState(false);
	const [loading, setLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const [showDiseaseModal, setShowDiseaseModal] = useState(false);
	const [showMedicineModal, setShowMedicineModal] = useState(false);
	const [submitLoading, setSubmitLoading] = useState(false);
	const [diseases, setDiseases] = useState<UserDisease[]>([]);
	const [medicines, setMedicines] = useState<Medicine[]>([]);
	const [selectedUserDisease, setSelectedUserDisease] = useState<UserDisease | null>(null);
	const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
	const [searchDiseaseText, setSearchDiseaseText] = useState('');
	const [searchMedicineText, setSearchMedicineText] = useState('');

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
			const diseaseResponse = await DiseaseService.getUserDiseases(user?.id as string);
			const medicineResponse = await MedicineService.getMedicines();
			setDiseases(diseaseResponse.data);
			setMedicines(medicineResponse.data);
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
		setSubmitLoading(true);
		const data = {
			...values,
			userId: user?.id as string,
			endDate: values.endDate ? values.endDate : null,
		};
		try {
			await saveMany([data]);
			showMessage({
				message: 'Informações salvas com sucesso!',
				type: 'success',
				icon: 'success',
			});
			resetForm();
			setSelectedUserDisease(null);
			setSelectedMedicine(null);
		} catch (error) {
			showMessage({
				message: 'Não consegui salvar as informações, pode tentar de novo?',
				type: 'danger',
				icon: 'danger',
			});
		} finally {
			setSubmitLoading(false);
		}
	}

	async function searchMedicine(text: string) {
		setSearchMedicineText(text);
		try {
			if (text) {
				const { data } = await MedicineService.getByName(text);
				setMedicines(data);
			} else {
				const { data } = await MedicineService.getMedicines();
				setMedicines(data);
			}
		} catch {
			showMessage({
				message: 'Erro ao tentar pesquisar os medicamentos',
				type: 'danger',
				icon: 'danger',
			});
		}
	}

	async function searchDisease(text: string) {
		setSearchDiseaseText(text);
		try {
			if (text) {
				const { data } = await DiseaseService.getByName(text);
				setDiseases(data);
			} else {
				const { data } = await DiseaseService.getUserDiseases(user?.id as string);
				setDiseases(data);
			}
		} catch {
			showMessage({
				message: 'Erro ao tentar pesquisar os medicamentos',
				type: 'danger',
				icon: 'danger',
			});
		}
	}
	return (
		<SafeAreaView style={styles.container}>
			{!loading && !hasError && (
				<KeyboardAwareScrollView style={styles.keyboard}>
					<View style={styles.header}>
						<View style={globalStyles.iconContainer}>{<NewMedicineIcon fill='#000' width='80' height='80' />}</View>
						<Text style={styles.title}>Novo Medicamento</Text>
					</View>
					<Form initialValues={initialValues} onSubmit={handleSubmitForm} validationSchema={validationSchema} validateOnChange={false}>
						{({ values, handleChange, handleSubmit, errors, setFieldTouched, touched, setFieldValue }) => (
							<>
								<View style={globalStyles.inputArea}>
									<InputButton
										label='Qual o medicamento que você toma?'
										errors={touched.medicineId && errors.medicineId ? errors.medicineId : ''}
										value={selectedMedicine === null ? '' : selectedMedicine.name}
										onBlur={() => setFieldTouched('medicineId')}
										disabled={submitLoading}
										onPress={() => setShowMedicineModal(true)}
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
										errors={touched.userDiseaseId && errors.userDiseaseId ? errors.userDiseaseId : ''}
										value={selectedUserDisease === null ? '' : selectedUserDisease.disease.name}
										onBlur={() => setFieldTouched('userDiseaseId')}
										disabled={submitLoading}
										onPress={() => setShowDiseaseModal(true)}
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
									/>

									<DateTimePickerModal
										isVisible={showEndDatePicker}
										mode='date'
										onConfirm={date => {
											setShowEndDatePicker(false);
											setFieldValue('endDate', date);
										}}
										onCancel={() => setShowEndDatePicker(false)}
									/>
								</View>

								<Button
									loading={submitLoading}
									onPress={async () => {
										if (selectedUserDisease !== null) {
											await setFieldValue('userDiseaseId', selectedUserDisease.id);
											setTimeout(() => setFieldTouched('userDiseaseId', true));
										}
										if (selectedMedicine !== null) {
											await setFieldValue('medicineId', selectedMedicine.id);
											setTimeout(() => setFieldTouched('medicineId', true));
										}
										handleSubmit();
									}}
									buttonText='Salvar'
									style={styles.submitLoading}
									icon={addIcon}
								/>
							</>
						)}
					</Form>
				</KeyboardAwareScrollView>
			)}
			<ModalComponent showModal={showDiseaseModal} close={() => setShowDiseaseModal(false)}>
				<View style={modalStyles.container}>
					<Text style={modalStyles.textHeader}>Selecione uma doença</Text>
					<InputComponent value={searchDiseaseText} onChangeText={searchDisease} label='Insira o nome do medicamento' icon={searchIcon} />
					<View style={modalStyles.scrollContainer}>
						<ScrollView style={modalStyles.scroll}>
							{diseases.map((userDisease, i) => (
								<TouchableWithoutFeedback
									key={i}
									onPress={() => {
										setSelectedUserDisease(userDisease);
										setShowDiseaseModal(false);
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

			<ModalComponent showModal={showMedicineModal} close={() => setShowMedicineModal(false)}>
				<View style={modalStyles.container}>
					<Text style={modalStyles.textHeader}>Selecione um medicamento</Text>
					<InputComponent value={searchMedicineText} onChangeText={searchMedicine} label='Insira o nome do medicamento' icon={searchIcon} />
					<View style={modalStyles.scrollContainer}>
						<ScrollView style={modalStyles.scroll}>
							{medicines.map((medicine, i) => (
								<TouchableWithoutFeedback
									key={i}
									onPress={() => {
										setSelectedMedicine(medicine);
										setShowMedicineModal(false);
									}}
								>
									<View style={[modalStyles.content, modalStyles.shadow]}>
										<Text style={modalStyles.text}> {medicine.name}</Text>
									</View>
								</TouchableWithoutFeedback>
							))}
						</ScrollView>
					</View>
				</View>
			</ModalComponent>
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
	scrollContainer: {
		width: '100%',
	},
	submitLoading: {
		alignSelf: 'center',
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
		marginBottom: 20,
	},

	scrollContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		marginBottom: 30,
		marginTop: 20,
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

export default NewUserMedicine;
