import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, BackHandler, View, ScrollView, RefreshControl } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { colors } from '../../assets/styles';
import { Card, ErrorComponent, FloatButton, LoadingComponent, MultiItems, NoDataComponent } from '../../components';
import AuthContext from '../../contexts/auth';
import BottomTabBarContext from '../../contexts/bottomTabBar';
import { Annotation } from '../../interfaces/annotation';
import { list, deleteMany } from '../../services/annotation';
import { cutString, DateTimeToBrDate } from '../../utils/function';
import PostItIcon from '../../assets/icons/post-it.svg';
import { buttonIcons } from '../../assets/icons';
interface MultiSelectItems extends Annotation {
	selected: boolean;
}

const Annotations: React.FC = () => {
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
			const { data } = await list(user?.id as string);
			const formattedData = data.map(annotation => ({ ...annotation, selected: false }));
			setItems(formattedData);
		} catch {
			setHasError(true);
			showMessage({
				message: 'Não consegui carregar a lista com as suas anotações',
				type: 'danger',
				icon: 'danger',
			});
		} finally {
			setLoading(false);
		}
	}

	async function onRefresh() {
		setLoading(true);
		await getData();
		showMessage({
			message: 'Lista atualizada!',
			type: 'success',
			icon: 'success',
		});
	}

	async function onDeleteItems() {
		const itemsSelected = items.filter(item => item.selected).map(item => item.id);
		setLoading(true);
		try {
			await deleteMany(itemsSelected);
			getData();
			showMessage({
				message: 'Anotações excluídas com sucesso!',
				type: 'success',
				icon: 'success',
			});
		} catch {
			showMessage({
				message: 'Não consegui excluir as anotações, pode tentar de novo?',
				type: 'danger',
				icon: 'danger',
			});
		} finally {
			onCancelSelectionItems();
		}
	}

	function onPressFloatButton() {
		navigation.navigate('NewAnnotation');
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
			navigation.navigate('AnnotationDetails', { id: items[elementIndex].id });
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
			<Text style={styles.title}>Minhas anotações</Text>
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
											<Text style={styles.itemName}>{cutString(item.description)}</Text>
											<Text style={styles.itemDate}>{`Criada  em:  ${DateTimeToBrDate(item.createdAt, 'Data não cadastrada')}`}</Text>
										</View>
										{!multiSelect && <PostItIcon fill='#000' width='90' height='90' />}
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
			{!multiSelect && <FloatButton icon={buttonIcons.newPostIt} style={styles.floatButton} onPress={onPressFloatButton} />}
			{loading && <LoadingComponent />}
			{hasError && <ErrorComponent />}
			{!loading && !hasError && items.length === 0 && <NoDataComponent />}
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
	title: {
		fontFamily: 'Poppins-SemiBold',
		fontSize: 20,
	},
	scrollContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '71%',
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

	itemName: {
		fontFamily: 'Poppins-Regular',
		fontSize: 17,
	},
	itemDate: {
		fontFamily: 'Poppins-Regular',
		fontSize: 13,
	},

	floatButton: {
		bottom: 100,
		right: 30,
	},
});

export default Annotations;
