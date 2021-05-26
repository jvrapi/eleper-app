import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Keyboard } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { buttonIcons, pageIcons } from '../../assets/icons';
import { colors, globalStyles } from '../../assets/styles';
import { Button, ErrorComponent, LoadingComponent, MultiSelect } from '../../components';
import { MultiSelectItems } from '../../components/MultiSelect';
import AuthContext from '../../contexts/auth';
import BottomTabBarContext from '../../contexts/bottomTabBar';
import { getUnrecordedDiseases, saveMany } from '../../services/user.disease';

const NewDisease = () => {
	const [items, setItems] = useState<MultiSelectItems[]>([]);
	const [loading, setLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const { user } = useContext(AuthContext);
	const { newDiseaseIcon } = pageIcons;
	const { addIcon } = buttonIcons;
	const { setShowTabBar } = useContext(BottomTabBarContext);

	function onSelectedItem(itemId: string) {
		const arrayFormatted = items.map(item => {
			if (item.id === itemId) {
				item.selected = !item.selected;
			}
			return item;
		});

		setItems(arrayFormatted);
	}

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

	useEffect(() => {
		getDiseases();
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
						<Button buttonText='Registrar doenças' icon={addIcon} onPress={onSubmit} />
					</View>
				</View>
			)}

			{loading && <LoadingComponent style={styles.loading} />}
			{hasError && <ErrorComponent />}
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
		height: 370,
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
	loading: {
		flex: 1,
	},
});

export default NewDisease;
