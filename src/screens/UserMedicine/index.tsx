import React, { useContext, useEffect, useState } from 'react';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/core';
import moment from 'moment';
import { BackHandler, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import MedicineIcon from '../../assets/icons/medicine-icon.svg';
import NewMedicineIcon from '../../assets/icons/new-medicine.svg';
import { colors } from '../../assets/styles';
import { Card, ErrorComponent, FloatButton, LoadingComponent, MultiItems, NoDataComponent } from '../../components';
import AuthContext from '../../contexts/auth';
import BottomTabBarContext from '../../contexts/bottomTabBar';
import { UserMedicine } from '../../interfaces/user.medicine';
import { deleteMany, getAll } from '../../services/user.medicine';

interface MultiSelectItems extends UserMedicine {
	selected: boolean;
}

const UserMedicines: React.FC = () => {
	const { user } = useContext(AuthContext);
	const { setShowTabBar } = useContext(BottomTabBarContext);
	const [items, setItems] = useState<MultiSelectItems[]>([]);
	const [loading, setLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const [multiSelect, setMultiSelect] = useState(false);
	const [allSelected, setAllSelected] = useState(false);
	const [selectedItemsAmount, setSelectedItemsAmount] = useState(0);
	const navigation = useNavigation();

	useEffect(() => {
		getData();
		navigation.addListener('focus', () => {
			getData();
		});
	}, []);

	useEffect(() => {
		function backAction() {
			if (multiSelect) {
				const updatedArray = items.map(item => {
					item.selected = false;
					setAllSelected(false);
					return item;
				});
				setItems(updatedArray);
				countSelectedItems(updatedArray);
				onCancelSelectionItems();
				return true;
			} else {
				return false;
			}
		}
		BackHandler.addEventListener('hardwareBackPress', backAction);

		return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
	}, [multiSelect, items]);

	async function getData() {
		try {
			const { data } = await getAll(user?.id as string);
			const formattedData = data.map(medicine => ({ ...medicine, selected: false }));
			setItems(formattedData);
		} catch {
			setHasError(true);
			showMessage({
				message: 'Não consegui listar os seus medicamentos',
				type: 'danger',
				icon: 'danger',
			});
		} finally {
			setLoading(false);
		}
	}

	async function onDeleteItems() {
		const itemsSelected = items.filter(item => item.selected).map(item => item.id);
		setLoading(true);
		try {
			await deleteMany(itemsSelected);
			getData();
			showMessage({
				message: 'Medicamentos excluídos com sucesso!',
				type: 'success',
				icon: 'success',
			});
		} catch {
			showMessage({
				message: 'Não consegui excluir os medicamentos, pode tentar de novo?',
				type: 'danger',
				icon: 'danger',
			});
		} finally {
			onCancelSelectionItems();
		}
	}

	async function onRefresh() {
		await getData();
		showMessage({
			message: 'Lista atualizada!',
			type: 'success',
			icon: 'success',
		});
	}

	function onPressFloatButton() {
		navigation.navigate('NewUserMedicine');
	}

	function onLongPressCard(firstElementIndex: number) {
		setMultiSelect(true);
		setShowTabBar(false);
		const updatedArray = items.map((item, i) => {
			if (i === firstElementIndex) {
				item.selected = true;
				setSelectedItemsAmount(selectedItemsAmount + 1);
			}
			return item;
		});
		setItems(updatedArray);
	}

	function onPressCard(elementIndex: number) {
		if (multiSelect) {
			const updatedArray = items.map((item, i) => {
				if (i === elementIndex) {
					item.selected = !item.selected;
				}
				return item;
			});

			countSelectedItems(updatedArray);
		} else {
			navigation.navigate('UserMedicineDetails', { id: items[elementIndex].id });
		}
	}

	function onPressSelectAllItems() {
		const updatedArray = items.map(item => {
			if (!allSelected) {
				item.selected = true;
				setAllSelected(true);
			} else {
				item.selected = false;
				setAllSelected(false);
			}
			return item;
		});
		setItems(updatedArray);
		countSelectedItems(updatedArray);
	}

	function countSelectedItems(updatedArray: MultiSelectItems[]) {
		const selectedAmount = updatedArray.filter(userDisease => userDisease.selected).length;
		if (selectedAmount === 0) {
			setSelectedItemsAmount(selectedAmount);
		} else {
			if (selectedAmount === items.length) {
				setAllSelected(true);
			} else {
				setAllSelected(false);
			}
			setSelectedItemsAmount(selectedAmount);
			setItems(updatedArray);
		}
	}

	function onCancelSelectionItems() {
		setMultiSelect(false);
		setShowTabBar(true);
		setSelectedItemsAmount(0);
	}

	function renderDateLabel(beginDate: string, endDate?: string) {
		const d1 = new Date(beginDate);
		if (endDate) {
			const d2 = new Date(endDate);
			const diff = moment(d2, 'YYYY-MM-DDThh:mm:ssZ').diff(moment(d1, 'YYYY-MM-DDThh:mm:ssZ'));
			const months = moment.duration(diff).asMonths();
			return `Tomou por ${Math.round(months)} meses`;
		} else {
			const d2 = new Date();
			const diff = moment(d2, 'YYYY-MM-DDThh:mm:ssZ').diff(moment(d1, 'YYYY-MM-DDThh:mm:ssZ'));
			const months = Math.floor(moment.duration(diff).asMonths());
			const days = Math.floor(moment.duration(diff).asDays());

			return `Tomando a ${months >= 1 ? `${months} ${months === 1 ? 'mês' : 'meses'}` : `${days} dias`}`;
		}
	}

	function multiItemsText() {
		let value;
		if (selectedItemsAmount === 0) {
			value = 'Selecionar itens';
		} else if (selectedItemsAmount === 1) {
			value = selectedItemsAmount + ' Item selecionado';
		} else {
			value = selectedItemsAmount + ' Itens selecionados';
		}

		return value + '';
	}

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Meus medicamentos</Text>

			{!loading && !hasError && items.length > 0 && (
				<>
					<MultiItems
						multiSelect={multiSelect}
						allSelected={allSelected}
						onPressSelectAllItems={onPressSelectAllItems}
						onPressCancel={onCancelSelectionItems}
						onPressDelete={onDeleteItems}
						itemsAmount={selectedItemsAmount}
						selectedItemsText={multiItemsText()}
					>
						<View style={styles.scrollContainer}>
							<ScrollView style={styles.scroll} refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}>
								{items.map((item, i) => (
									<Card key={i} style={[styles.card, styles.shadow]} onLongPress={() => onLongPressCard(i)} onPress={() => onPressCard(i)}>
										<View style={styles.textContainer}>
											<Text style={styles.itemTitle}>{item.medicine.name}</Text>
											<Text style={styles.itemSubTitle}>{`Tomando para ${item.disease.name}`}</Text>
											<Text style={styles.itemSubTitle}>{renderDateLabel(item.beginDate, item.endDate)}</Text>
										</View>
										{!multiSelect && <MedicineIcon width='50' height='50' fill='#000000' />}
										{multiSelect && (
											<CheckBox value={item.selected} tintColors={{ true: colors.darkBlue, false: colors.blue }} disabled={true} />
										)}
									</Card>
								))}
							</ScrollView>
						</View>
					</MultiItems>
				</>
			)}
			{!multiSelect && (
				<FloatButton
					icon={<NewMedicineIcon width='40' height='40' fill='#fff' />}
					style={styles.floatButton}
					onPress={onPressFloatButton}
				/>
			)}
			{loading && <LoadingComponent style={styles.loading} />}
			{hasError && <ErrorComponent />}
			{!loading && !hasError && items.length === 0 && <NoDataComponent />}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: colors.screenColor,
	},

	title: {
		fontFamily: 'Poppins-SemiBold',
		fontSize: 20,
	},

	scrollContainer: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: '100%',
		height: '71%',
		marginBottom: 95,
	},

	scroll: {
		width: '100%',
		padding: 10,
	},

	card: {
		marginVertical: 10,
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		padding: 20,
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

	textContainer: {
		justifyContent: 'center',
	},

	itemTitle: {
		fontFamily: 'Poppins-Regular',
		fontSize: 17,
	},
	itemSubTitle: {
		fontFamily: 'Poppins-Regular',
		fontSize: 13,
		marginLeft: 5,
	},
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	lastButton: {
		marginTop: 20,
	},

	floatButton: {
		bottom: 100,
		right: 30,
	},
	loading: {
		flex: 1,
	},
});

export default UserMedicines;
