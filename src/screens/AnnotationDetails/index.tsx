import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableWithoutFeedback, ScrollView, Keyboard } from 'react-native';
import { Annotation } from '../../interfaces/annotation';
import { UserDisease } from '../../interfaces/user.disease';
import { showMessage } from 'react-native-flash-message';
import { RouteProp } from '@react-navigation/core';
import { getById, update } from '../../services/annotation';
import { getUserDiseases } from '../../services/user.disease';

import { colors, globalStyles } from '../../assets/styles';

import NewPostItIcon from '../../assets/icons/new-post-it.svg';
import UserDiseaseIcon from '../../assets/icons/user-disease.svg';
import PostItEdit from '../../assets/icons/post-it-edit.svg';

import { Formik as Form } from 'formik';
import * as Yup from 'yup';
import { Button, InputButton, ModalComponent, TextArea } from '../../components';
import { buttonIcons } from '../../assets/icons';
import BottomTabBarContext from '../../contexts/bottomTabBar';

type RootStackParamList = {
	AnnotationDetails: { id: string };
};

type AnnotationDetailsScreenRouteProp = RouteProp<RootStackParamList, 'AnnotationDetails'>;

type Props = {
	route: AnnotationDetailsScreenRouteProp;
};

const initialValues: Annotation = {
	description: '',
	userId: '',
	diseaseId: '',
	id: '',
	createdAt: '',
	disease: {
		id: '',
		name: '',
	},
};

const validationSchema = Yup.object().shape({
	description: Yup.string().required('Informe a descrição da anotação'),
});

const AnnotationDetails: React.FC<Props> = ({ route }) => {
	const { id } = route.params;
	const { setShowTabBar } = useContext(BottomTabBarContext);
	const { updateIcon } = buttonIcons;
	const [data, setData] = useState<Annotation>(initialValues);
	const [items, setItems] = useState<UserDisease[]>([]);
	const [loading, setLoading] = useState(true);
	const [submitForm, setSubmitForm] = useState(false);
	const [hasError, setHasError] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [selectedDiseaseIndex, setSelectedDiseaseIndex] = useState<number | null>(null);

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
			const annotationsResponse = await getById(id);
			setData(annotationsResponse.data);

			const userDiseaseResponse = await getUserDiseases(annotationsResponse.data.userId);
			setItems(userDiseaseResponse.data);

			if (annotationsResponse.data.disease) {
				userDiseaseResponse.data.forEach((userDisease, i) => {
					if (annotationsResponse.data.disease.id === userDisease.disease.id) {
						setSelectedDiseaseIndex(i);
					}
				});
			}
		} catch (error) {
			showMessage({
				message: 'Não consegui recuperar as informações, pode tentar de novo?',
				icon: 'danger',
				type: 'danger',
			});
			setHasError(true);
		} finally {
			setLoading(false);
		}
	}

	async function handleSubmitForm(values: Annotation) {
		setSubmitForm(true);
		try {
			const { data } = await update(values);

			if (data.disease.id) {
				items.forEach((userDisease, i) => {
					if (data.disease.id === userDisease.disease.id) {
						setSelectedDiseaseIndex(i);
					}
				});
			}
			showMessage({
				message: 'Informações salvas com sucesso!',
				type: 'success',
				icon: 'success',
			});
		} catch {
			showMessage({
				message: 'Não consegui salvar as informações, pode tentar de novo?',
				type: 'danger',
				icon: 'danger',
			});
		} finally {
			setSubmitForm(false);
		}
	}

	function selectedDisease(diseaseArrayIndex: number) {
		setSelectedDiseaseIndex(diseaseArrayIndex);
		setShowModal(false);
	}

	return (
		<SafeAreaView style={styles.container}>
			{!loading && !hasError && (
				<>
					<View style={styles.header}>
						<View style={globalStyles.iconContainer}>{<NewPostItIcon fill='#000' width='70' height='70' />}</View>
						<Text style={styles.title}>Nova Anotação</Text>
					</View>
					<Form
						enableReinitialize
						initialValues={data}
						onSubmit={handleSubmitForm}
						validationSchema={validationSchema}
						validateOnChange={false}
						validateOnBlur={false}
					>
						{({ values, handleChange, handleSubmit, errors, setFieldTouched, touched, setFieldValue }) => (
							<>
								<View style={globalStyles.inputArea}>
									<TextArea
										value={values.description}
										label='Nome do medicamento que você toma'
										onChangeText={handleChange('description')}
										errors={touched.description && errors.description ? errors.description : ''}
										onBlur={() => setFieldTouched('description')}
										editable={!submitForm}
										icon={<PostItEdit fill='#efefef' width='100' height='100' />}
									/>
									<InputButton
										label='Para qual doença é essa anotação?'
										errors={touched.diseaseId && errors.diseaseId ? errors.diseaseId : ''}
										value={selectedDiseaseIndex === null ? '' : items[selectedDiseaseIndex].disease.name}
										onBlur={() => setFieldTouched('diseaseId')}
										disabled={submitForm}
										onPress={() => setShowModal(true)}
										icon={<UserDiseaseIcon fill='#000' width='35' height='35' />}
									/>
								</View>
								<Button loading={submitForm} onPress={handleSubmit} buttonText='Atualizar' icon={updateIcon} />

								<ModalComponent showModal={showModal} close={() => setShowModal(false)}>
									<View style={modalStyles.container}>
										<Text style={modalStyles.textHeader}>Selecione uma doença</Text>
										<View style={modalStyles.scrollContainer}>
											<ScrollView style={modalStyles.scroll}>
												{items.map((userDisease, i) => (
													<TouchableWithoutFeedback
														key={i}
														onPress={() => {
															setFieldValue('diseaseId', userDisease.disease.id);
															selectedDisease(i);
															setShowModal(false);
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
							</>
						)}
					</Form>
				</>
			)}
		</SafeAreaView>
	);
};

export default AnnotationDetails;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
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
		marginBottom: 95,
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
