import { Formik as Form, FormikHelpers } from 'formik';
import moment from 'moment';
import React, { useContext, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Yup from 'yup';
import { buttonIcons } from '../../assets/icons';
import HospitalizationDateIcon from '../../assets/icons/hospital-date.svg';
import HospitalizationIcon from '../../assets/icons/hospitalization.svg';
import MedicalToolsIcon from '../../assets/icons/medical-tools.svg';
import StethoscopeIcon from '../../assets/icons/stethoscope.svg';
import SurgeryAfterEffectsIcon from '../../assets/icons/surgery-after-effects.svg';
import UserSurgeryIcons from '../../assets/icons/user-surgery.svg';
import { colors, globalStyles } from '../../assets/styles';
import { Button, InputButton, InputComponent } from '../../components';
import AuthContext from '../../contexts/auth';
import { Save } from '../../interfaces/user.surgery';
import { save } from '../../services/user.surgery';
import { DateTimeToBrDate } from '../../utils/function';

const initialValues: Save = {
	userId: '',
	hospitalization: {
		entranceDate: '',
		exitDate: '',
		location: '',
		reason: '',
	},
	afterEffects: '',
	surgery: '',
};

const validationSchema = Yup.object().shape({
	surgery: Yup.string().required('Informe a cirurgia realizada'),
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

	const { addIcon } = buttonIcons;
	const [showEntranceDatePicker, setShowEntranceDatePicker] = useState(false);
	const [showExitDatePicker, setShowExitDatePicker] = useState(false);
	const [submitLoading, setSubmitLoading] = useState(false);

	async function handleSubmitForm(values: Save, { resetForm }: FormikHelpers<Save>) {
		values.userId = user?.id as string;
		setSubmitLoading(true);
		try {
			await save(values);
			resetForm();
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
			<KeyboardAwareScrollView style={styles.keyboard}>
				<View style={styles.header}>
					<View style={globalStyles.iconContainer}>{<UserSurgeryIcons fill='#000' width='80' height='80' />}</View>
					<Text style={styles.title}>Nova cirurgia</Text>
				</View>
				<Form initialValues={initialValues} onSubmit={handleSubmitForm} validationSchema={validationSchema} validateOnChange={false}>
					{({ values, handleChange, handleSubmit, errors, setFieldTouched, touched, setFieldValue }) => (
						<>
							<View style={globalStyles.inputArea}>
								<InputComponent
									value={values.surgery}
									label='Qual a cigurgia que você realizou?'
									onChangeText={handleChange('surgery')}
									errors={touched.surgery && errors.surgery ? errors.surgery : ''}
									onBlur={() => setFieldTouched('surgery')}
									editable={!submitLoading}
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
										touched.hospitalization?.entranceDate && errors.hospitalization?.entranceDate ? errors.hospitalization.entranceDate : ''
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
							<Button loading={submitLoading} onPress={handleSubmit} buttonText='Salvar' style={styles.submitLoading} icon={addIcon} />
						</>
					)}
				</Form>
			</KeyboardAwareScrollView>
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
});
