import { RouteProp } from '@react-navigation/core';
import React, { useContext, useEffect, useState } from 'react';
import { Keyboard, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { buttonIcons } from '../../assets/icons';
import { Button, InputButton, InputComponent, ErrorComponent, LoadingComponent, ModalComponent } from '../../components';
import { Formik as Form } from 'formik';
import { DateTimeToBrDate } from '../../utils/function';
import * as Yup from 'yup';
import HospitalizationDateIcon from '../../assets/icons/hospital-date.svg';
import HospitalizationIcon from '../../assets/icons/hospitalization.svg';
import MedicalMaskIcon from '../../assets/icons/medical-mask.svg';
import HospitalizationDetailsIcon from '../../assets/icons/hospital-bed.svg';
import StethoscopeIcon from '../../assets/icons/stethoscope.svg';
import { colors, globalStyles } from '../../assets/styles';
import MultiSelect, { MultiSelectItems } from '../../components/MultiSelect';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Hospitalization } from '../../interfaces/hospitalization';
import { getAll } from '../../services/disease';
import { getById, update } from '../../services/hospitalization';
import { showMessage } from 'react-native-flash-message';
import BottomTabBarContext from '../../contexts/bottomTabBar';

type RootStackParamList = {
	HospitalizationDetails: { id: string };
};

type HospitalizationDetailsScreenRouteProp = RouteProp<RootStackParamList, 'HospitalizationDetails'>;

type Props = {
	route: HospitalizationDetailsScreenRouteProp;
};

const disease = {
	id: '',
	name: '',
};

const initialValues: Hospitalization = {
	id: '',
	userId: '',
	entranceDate: '',
	exitDate: '',
	location: '',
	reason: '',
	diseases: [disease],
};

const validationSchema = Yup.object().shape({});

const HospitalizationDetails: React.FC<Props> = ({ route }) => {
	const { id } = route.params;
	const { setShowTabBar } = useContext(BottomTabBarContext);
	const { updateIcon, checkIcon } = buttonIcons;
	const [items, setItems] = useState<MultiSelectItems[]>([]);
	const [hospitalization, setHospitalization] = useState(initialValues);
	const [loading, setLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const [submitLoading, setSubmitLoading] = useState(false);
	const [showEntranceDatePicker, setShowEntranceDatePicker] = useState(false);
	const [showExitDatePicker, setShowExitDatePicker] = useState(false);
	const [showModal, setShowModal] = useState(false);

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
			const diseaseResponse = await getAll();
			const hospitalizationResponse = await getById(id);

			const formattedData = diseaseResponse.data.map(disease => {
				const response = { ...disease, selected: false };

				hospitalizationResponse.data.diseases.forEach(hospitalizationDisease => {
					if (hospitalizationDisease.id === disease.id) {
						response.selected = true;
					}
				});

				return response;
			});
			setItems(formattedData);
			setHospitalization(hospitalizationResponse.data);
		} catch (error) {
			showMessage({
				message: 'Ops! Não consegui carregar os dados',
				type: 'danger',
				icon: 'danger',
			});
			setHasError(true);
		} finally {
			setLoading(false);
		}
	}

	async function handleSubmitForm(values: Hospitalization) {
		setSubmitLoading(true);
		values.diseases = items.filter(item => item.selected);
		try {
			const { data } = await update(values);
			setHospitalization(data);
			showMessage({
				message: 'Informações atualizadas com sucesso!',
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

	function diseasesInputLabel() {
		const itemsSelected = items.filter(item => item.selected);
		if (itemsSelected.length === 0) {
			return '';
		}
		if (itemsSelected.length === 1) {
			return itemsSelected[0].name;
		}
		if (itemsSelected.length === 2) {
			return `${itemsSelected[0].name}, ${itemsSelected[1].name}`;
		}
		return `${itemsSelected[0].name}, ${itemsSelected[1].name}, ...`;
	}

	return (
		<SafeAreaView style={styles.container}>
			{!loading && !hasError && (
				<>
					<View style={styles.header}>
						<View style={globalStyles.iconContainer}>{<HospitalizationDetailsIcon fill='#000' width='80' height='80' />}</View>
						<Text style={styles.title}>Detalhes internação</Text>
					</View>
					<Form
						enableReinitialize
						initialValues={hospitalization}
						onSubmit={handleSubmitForm}
						validationSchema={validationSchema}
						validateOnChange={false}
						validateOnBlur={false}
					>
						{({ values, handleChange, handleSubmit, errors, setFieldTouched, touched, setFieldValue }) => (
							<>
								<View style={globalStyles.inputArea}>
									<InputComponent
										value={values.location}
										label='Aonde aconteceu a internação?'
										onChangeText={handleChange('location')}
										errors={touched.location && errors.location ? errors.location : ''}
										onBlur={() => setFieldTouched('location')}
										editable={!submitLoading}
										icon={<HospitalizationIcon fill='#000' width='35' height='35' />}
									/>
									<InputComponent
										value={values.reason}
										label='Qual o motivo da internação?'
										onChangeText={handleChange('reason')}
										errors={touched.reason && errors.reason ? errors.reason : ''}
										onBlur={() => setFieldTouched('reason')}
										editable={!submitLoading}
										icon={<StethoscopeIcon fill='#000' width='40' height='40' />}
									/>

									<InputButton
										label='Quando começou a internação?'
										errors={touched.entranceDate && errors.entranceDate ? errors.entranceDate : ''}
										value={DateTimeToBrDate(values.entranceDate)}
										onBlur={() => setFieldTouched('.entranceDate')}
										disabled={submitLoading}
										onPress={() => setShowEntranceDatePicker(true)}
										icon={<HospitalizationDateIcon fill='#000' width='40' height='40' />}
									/>

									<InputButton
										label='Quando terminou a internação?'
										errors={touched.exitDate && errors.exitDate ? errors.exitDate : ''}
										value={DateTimeToBrDate(values.exitDate ? values.exitDate : '')}
										onBlur={() => setFieldTouched('exitDate')}
										disabled={submitLoading}
										onPress={() => setShowExitDatePicker(true)}
										icon={<HospitalizationDateIcon fill='#000' width='40' height='40' />}
									/>

									<InputButton
										label='Quais foram as doenças durante a internação?'
										errors={touched.diseases && errors.diseases ? errors.diseases : ''}
										value={diseasesInputLabel()}
										onBlur={() => setFieldTouched('diseases')}
										disabled={submitLoading}
										onPress={() => setShowModal(true)}
										icon={<MedicalMaskIcon fill='#000' width='40' height='40' />}
									/>

									<DateTimePickerModal
										isVisible={showEntranceDatePicker}
										mode='date'
										onConfirm={date => {
											setShowEntranceDatePicker(false);
											setFieldValue('entranceDate', date);
										}}
										onCancel={() => setShowEntranceDatePicker(false)}
									/>

									<DateTimePickerModal
										isVisible={showExitDatePicker}
										mode='date'
										onConfirm={date => {
											setShowExitDatePicker(false);
											setFieldValue('exitDate', date);
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

								<ModalComponent showModal={showModal} close={() => setShowModal(false)}>
									<View style={modalStyles.container}>
										<Text style={modalStyles.textHeader}>Selecione uma doença</Text>
										<View style={modalStyles.scrollContainer}>
											<MultiSelect
												listItems={items}
												inputLabelText='Toque aqui para listar as doenças'
												onSelectedItem={id => {
													const arrayFormatted = items.map(item => {
														if (item.id === id) {
															item.selected = !item.selected;
														}
														return item;
													});
													const selected = arrayFormatted.filter(item => item.selected).map(item => item.id);
													setItems(arrayFormatted);
													setFieldValue('diseases', selected);
												}}
											/>
										</View>
										<Button
											onPress={() => setShowModal(false)}
											buttonText='Finalizado'
											icon={checkIcon}
											style={modalStyles.submitLoading}
										/>
									</View>
								</ModalComponent>
							</>
						)}
					</Form>
				</>
			)}
			{loading && <LoadingComponent style={styles.loading} />}
			{hasError && <ErrorComponent />}
		</SafeAreaView>
	);
};

export default HospitalizationDetails;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-start',
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
	submitLoading: {
		marginVertical: 10,
	},
});
