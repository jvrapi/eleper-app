import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, globalStyles } from '../../assets/styles';
import { pageIcons, buttonIcons, inputIcons } from '../../assets/icons';
import { Button, MultiSelect, LoadingComponent, ErrorComponent, ModalComponent, InputComponent } from '../../components';
import { MultiSelectItems } from '../../components/MultiSelect';

import { getUnrecordedDiseases, saveMany } from '../../services/user.disease';
import { save } from '../../services/disease';

import { showMessage } from 'react-native-flash-message';
import AuthContext from '../../contexts/auth';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Yup from 'yup';
import { Formik as Form } from 'formik';

const NewDisease = () => {
	const [items, setItems] = useState<MultiSelectItems[]>([]);
	const [loading, setLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const { user } = useContext(AuthContext);
	const { newDiseaseIcon } = pageIcons;
	const { checkIcon, addIcon } = buttonIcons;
	const { diseaseIcon } = inputIcons;

	const [showModal, setShowModal] = useState(false);
	const [savingDisease, setSavingDisease] = useState(false);

	function onSelectedItem(itemId: string) {
		const arrayFormatted = items.map(item => {
			if (item.id === itemId) {
				item.selected = !item.selected;
			}
			return item;
		});

		setItems(arrayFormatted);
	}

	const initialValues = {
		name: '',
	};

	const validationSchema = Yup.object().shape({
		name: Yup.string().required('Preencha este campo'),
	});

	async function getDiseases() {
		try {
			const { data } = await getUnrecordedDiseases(user?.id as string);
			const formattedData = data.map(disease => ({ ...disease, selected: false }));

			setItems(formattedData);
		} catch (error) {
			setHasError(true);
			showMessage({
				message: 'Não consegui recuperar a lista de doenças, pode tentar de novo?',
				type: 'danger',
				icon: 'danger',
			});
		} finally {
			setLoading(false);
		}
	}

	async function onSubmit() {
		const itemsSelected = items
			.filter(item => item.selected)
			.map(disease => ({
				userId: user?.id as string,
				diseaseId: disease.id,
			}));
		if (itemsSelected.length === 0) {
			showMessage({
				message: 'Ops! Você precisa selecionar alguma doença para continuar',
				type: 'warning',
				icon: 'warning',
			});
		}

		try {
			await saveMany(itemsSelected);
			showMessage({
				message: 'Suas doenças foram atualizadas!',
				type: 'success',
				icon: 'success',
			});
			getDiseases();
		} catch (error) {
			setLoading(false);
			showMessage({
				message: 'Ops! Ocorreu algum erro quando eu tentei cadastrar seus dados. Pode tentar de novo?',
				type: 'danger',
				icon: 'danger',
			});
		}
	}

	async function handleSubmitForm(formValues: { name: string }) {
		setSavingDisease(true);
		try {
			await save(formValues);
			setShowModal(false);
			await getDiseases();
			showMessage({
				message: 'Obrigado! Acrescentamos essa doença no nossos registros',
				type: 'success',
				icon: 'success',
			});
		} catch (error) {
			setSavingDisease(false);

			showMessage({
				message: 'Não consegui salvar essa doença, pode tentar de novo?',
				type: 'danger',
				icon: 'danger',
			});
		}
	}

	useEffect(() => {
		getDiseases();
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			{!loading && !hasError && (
				<View style={styles.container}>
					<View style={styles.header}>
						<View style={globalStyles.iconContainer}>{newDiseaseIcon}</View>
						<Text style={styles.title}>Atualizar Doenças</Text>
					</View>

					<View style={styles.scroll}>
						<MultiSelect listItems={items} inputLabelText='Toque aqui para listar as doenças' onSelectedItem={onSelectedItem} />
					</View>

					<View style={styles.Button}>
						<Button buttonText='Registrar doenças' icon={checkIcon} onPress={onSubmit} />
					</View>

					<TouchableOpacity>
						<Text style={styles.diseaseNotFoundButtonText} onPress={() => setShowModal(true)}>
							Não encontrei a doença
						</Text>
					</TouchableOpacity>
				</View>
			)}

			{loading && <LoadingComponent />}
			{hasError && <ErrorComponent />}
			<ModalComponent showModal={showModal} close={() => setShowModal(false)}>
				<View style={styles.modalBody}>
					<Text style={styles.text}>
						Nos ajude a melhorar! {'\n'} Informe qual doença você não encontrou e eu a cadastrarei no meu banco de dados
					</Text>
					<Form initialValues={initialValues} onSubmit={handleSubmitForm} validationSchema={validationSchema} validateOnChange={false}>
						{({ values, handleChange, handleSubmit, errors, setFieldTouched, touched }) => (
							<>
								<InputComponent
									label='Digite o nome da doença'
									icon={diseaseIcon}
									value={values.name}
									onChangeText={handleChange('name')}
									errors={touched.name && errors.name ? errors.name : ''}
									onBlur={() => setFieldTouched('name')}
									editable={!savingDisease}
								/>
								<Button buttonText='Finalizado' icon={addIcon} loading={savingDisease} onPress={() => handleSubmit()} />
							</>
						)}
					</Form>
				</View>
			</ModalComponent>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
		backgroundColor: colors.screenColor,
		width: '100%',
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
	scroll: {
		height: 270,
		width: '95%',
		marginVertical: 30,
		alignItems: 'center',
		justifyContent: 'center',
	},

	Button: {
		marginBottom: 20,
		width: '100%',
		alignItems: 'center',
	},
	diseaseNotFoundButtonText: {
		fontSize: 17,
		color: colors.blue,
		fontFamily: 'Poppins-SemiBold',
	},
	modalBody: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		marginTop: 50,
		textAlign: 'center',
		fontFamily: 'Poppins-Regular',
		fontSize: 16,
	},
	loadingText: {
		fontFamily: 'Poppins-Regular',
		fontSize: 17,
		textAlign: 'center',
		marginHorizontal: 10,
	},
});

export default NewDisease;
