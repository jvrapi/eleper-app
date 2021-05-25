import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { buttonIcons } from '../../assets/icons';
import { colors } from '../../assets/styles';
import { Button, ErrorComponent, LoadingComponent, MultiSelect } from '../../components';
import { MultiSelectItems } from '../../components/MultiSelect';
import AuthContext from '../../contexts/auth';
import * as DiseaseService from '../../services/disease';
import * as UserDiseaseService from '../../services/user.disease';

const NewUserRegisterDisease = () => {
	const [items, setItems] = useState<MultiSelectItems[]>([]);
	const [loading, setLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const [loadingText, setLoadingText] = useState('Estou preparando algumas coisas, por favor aguarde');
	const { addIcon } = buttonIcons;
	const navigation = useNavigation();
	const { user } = useContext(AuthContext);

	async function getDiseases() {
		try {
			const { data } = await DiseaseService.getAll();
			const formattedData = data.map(disease => ({ ...disease, selected: false }));
			setItems(formattedData);
		} catch (error) {
			setHasError(true);
			showMessage({
				message: error.response.data.error,
				type: 'danger',
				icon: 'danger',
			});
		} finally {
			setLoading(false);
		}
	}

	function onSelectedItem(itemId: string) {
		const arrayFormatted = items.map(item => {
			if (item.id === itemId) {
				item.selected = !item.selected;
			}
			return item;
		});

		setItems(arrayFormatted);
	}

	async function registerDiseasesTerminated() {
		setLoading(true);
		setLoadingText('Estou cadastrando essas informações, aguarde alguns instantes');
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
			await UserDiseaseService.saveMany(itemsSelected);
			navigation.reset({ routes: [{ name: 'Home' }] });
		} catch (error) {
			setLoading(false);
			showMessage({
				message: 'Ops! Ocorreu algum erro quando eu tentei cadastrar seus dados. Pode tentar de novo?',
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
					<Text style={styles.title}>Vamos começar</Text>
					<Text style={styles.subTitle}>
						Me informe alguma doença que você ja teve ou tem.
						{'\n'}
						Você pode escolher mais de uma
					</Text>
					<View style={styles.scroll}>
						<MultiSelect listItems={items} inputLabelText='Toque aqui para listar as doenças' onSelectedItem={onSelectedItem} />
					</View>
					<View style={styles.Button}>
						<Button buttonText='Finalizei!' icon={addIcon} onPress={registerDiseasesTerminated} />
					</View>
				</View>
			)}
			{loading && (
				<>
					<Text style={styles.loadingText}>{loadingText}</Text>
					<LoadingComponent />
				</>
			)}
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
		width: '100%',
	},

	title: {
		fontFamily: 'Poppins-SemiBold',
		fontSize: 20,
	},
	subTitle: {
		fontSize: 16,
		fontFamily: 'Poppins-SemiBold',
		width: 300,
		textAlign: 'center',
		marginTop: 20,
	},
	scroll: {
		height: 400,
		width: '95%',
		marginVertical: 30,
		alignItems: 'center',
		justifyContent: 'center',
	},
	diseaseNotFoundButtonText: {
		fontSize: 17,
		color: colors.blue,
		fontFamily: 'Poppins-SemiBold',
	},
	Button: {
		marginBottom: 30,
		width: '100%',
		alignItems: 'center',
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

export default NewUserRegisterDisease;
