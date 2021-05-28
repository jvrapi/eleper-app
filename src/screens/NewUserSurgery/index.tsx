import { Formik as Form, FormikHelpers } from 'formik';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { Keyboard, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Yup from 'yup';
import { buttonIcons, pageIcons } from '../../assets/icons';
import HospitalizationDateIcon from '../../assets/icons/hospital-date.svg';
import HospitalizationIcon from '../../assets/icons/hospitalization.svg';
import MedicalToolsIcon from '../../assets/icons/medical-tools.svg';
import StethoscopeIcon from '../../assets/icons/stethoscope.svg';
import SurgeryAfterEffectsIcon from '../../assets/icons/surgery-after-effects.svg';
import UserSurgeryIcons from '../../assets/icons/user-surgery.svg';
import { colors, globalStyles } from '../../assets/styles';
import { Button, ErrorComponent, InputButton, InputComponent, LoadingComponent, ModalComponent } from '../../components';
import AuthContext from '../../contexts/auth';
import { Surgery } from '../../interfaces/surgery';
import { Save } from '../../interfaces/user.surgery';
import { save } from '../../services/user.surgery';
import { DateTimeToBrDate } from '../../utils/function';
import { getSurgeries, getByName } from '../../services/surgery';
import BottomTabBarContext from '../../contexts/bottomTabBar';

const initialValues: Save = {
	userId: '',
	hospitalization: {
		entranceDate: '',
		exitDate: '',
		location: '',
		reason: '',
	},
	afterEffects: '',
	surgeryId: '',
};

const validationSchema = Yup.object().shape({
	surgeryId: Yup.string().required('Informe a cirurgia realizada'),
	hospitalization: Yup.object().shape({
		entranceDate: Yup.string()
			.test('date-validation', 'Data não é valida', date => {
				const dateIsValid = moment(new Date(date as string), 'YYYY-MM-DDThh:mm:ssZ', true).isValid();
				return dateIsValid;
			})
			.required('Informe a data de entrada'),

		location: Yup.string().required('Informe aonde aconteceu a internação'),
		reason: Yup.string().required('Informe o motivo da internação'),
	}),
	afterEffects: Yup.string(),
});

const NewUserSurgery: React.FC = () => {
	const { user } = useContext(AuthContext);
	const { setShowTabBar } = useContext(BottomTabBarContext);

	const { addIcon } = buttonIcons;
	const { searchIcon } = pageIcons;
	const [showEntranceDatePicker, setShowEntranceDatePicker] = useState(false);
	const [showExitDatePicker, setShowExitDatePicker] = useState(false);
	const [submitLoading, setSubmitLoading] = useState(false);
	const [showSurgeriesModal, setShowSurgeriesModal] = useState(false);
	const [searchSurgeryText, setSearchSurgeryText] = useState('');
	const [selectedSurgery, setSelectedSurgery] = useState<Surgery | null>(null);
	const [surgeries, setSurgeries] = useState<Surgery[]>([]);
	const [loading, setLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
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
			const { data } = await getSurgeries();
			setSurgeries(data);
		} catch (error) {
			showMessage({
				message: 'Não consegui salvar as informações, pode tentar de novo?',
				type: 'danger',
				icon: 'danger',
			});
			setHasError(true);
		} finally {
			setLoading(false);
		}
	}

	async function handleSubmitForm(values: Save, { resetForm }: FormikHelpers<Save>) {
		values.userId = user?.id as string;
		setSubmitLoading(true);
		try {
			await save(values);
			resetForm();
			setSelectedSurgery(null);
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

	async function searchSurgery(value: string) {
		setSearchSurgeryText(value);
		try {
			if (value) {
				const { data } = await getByName(value);
				setSurgeries(data);
			} else {
				const { data } = await getSurgeries();
				setSurgeries(data);
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
				<>
					<KeyboardAwareScrollView style={[styles.keyboard, scrollStyles.scroll]}>
						<View style={styles.header}>
							<View style={globalStyles.iconContainer}>{<UserSurgeryIcons fill='#000' width='80' height='80' />}</View>
							<Text style={styles.title}>Nova cirurgia</Text>
						</View>
						<Form
							initialValues={initialValues}
							onSubmit={handleSubmitForm}
							validationSchema={validationSchema}
							validateOnChange={false}
							validateOnBlur={false}
						>
							{({ values, handleChange, handleSubmit, errors, setFieldTouched, touched, setFieldValue }) => (
								<>
									<View style={globalStyles.inputArea}>
										<InputButton
											value={selectedSurgery === null ? '' : selectedSurgery.name}
											label='Qual a cigurgia que você realizou?'
											onPress={() => setShowSurgeriesModal(true)}
											errors={touched.surgeryId && errors.surgeryId ? errors.surgeryId : ''}
											onBlur={() => setFieldTouched('surgeryId')}
											disabled={submitLoading}
											icon={<MedicalToolsIcon fill='#000' width='40' height='40' />}
										/>
										<InputComponent
											value={values.hospitalization.location}
											label='Aonde aconteceu a cirurgia?'
											onChangeText={handleChange('hospitalization.location')}
											errors={touched.hospitalization?.location && errors.hospitalization?.location ? errors.hospitalization.location : ''}
											onBlur={() => setFieldTouched('hospitalization.location')}
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
										onPress={async () => {
											if (selectedSurgery !== null) {
												await setFieldValue('surgeryId', selectedSurgery.id);
												setTimeout(() => setFieldTouched('surgeryId', true));
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
					<ModalComponent showModal={showSurgeriesModal} close={() => setShowSurgeriesModal(false)}>
						<View style={modalStyles.container}>
							<Text style={modalStyles.textHeader}>Selecione uma doença</Text>
							<InputComponent
								value={searchSurgeryText}
								onChangeText={searchSurgery}
								label='Insira o nome do medicamento'
								icon={searchIcon}
							/>
							<View style={modalStyles.scrollContainer}>
								<ScrollView style={modalStyles.scroll}>
									{surgeries.map((surgery, i) => (
										<TouchableWithoutFeedback
											key={i}
											onPress={() => {
												setSelectedSurgery(surgery);
												setShowSurgeriesModal(false);
											}}
										>
											<View style={[modalStyles.content, modalStyles.shadow]}>
												<Text style={modalStyles.text}> {surgery.name}</Text>
											</View>
										</TouchableWithoutFeedback>
									))}
								</ScrollView>
							</View>
						</View>
					</ModalComponent>
				</>
			)}
			{loading && <LoadingComponent style={styles.loading} />}
			{hasError && <ErrorComponent />}
		</SafeAreaView>
	);
};

export default NewUserSurgery;

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
		marginBottom: 20,
	},
	loading: {
		flex: 1,
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
