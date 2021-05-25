import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, RefreshControl, Linking, BackHandler } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { colors } from '../../assets/styles';
import AuthContext from '../../contexts/auth';
import { Exam } from '../../interfaces/exam';
import { getAll, deleteMany } from '../../services/exam';
import api from '../../services/api';
import { Button, Card, ErrorComponent, FloatButton, LoadingComponent, ModalComponent, MultiItems, NoDataComponent } from '../../components';
import { DateTimeToBrDate } from '../../utils/function';
import { pageIcons, buttonIcons } from '../../assets/icons';
import { useNavigation } from '@react-navigation/native';
import BottomTabBarContext from '../../contexts/bottomTabBar';
import CheckBox from '@react-native-community/checkbox';

interface MultiSelectItems extends Exam {
	selected: boolean;
}

const ExamScreen: React.FC = () => {
	const { user } = useContext(AuthContext);
	const { setShowTabBar } = useContext(BottomTabBarContext);

	const [items, setItems] = useState<MultiSelectItems[]>([]);
	const [selectedExam, setSelectedExam] = useState<Exam>({} as Exam);
	const [loading, setLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [multiSelect, setMultiSelect] = useState(false);
	const [allSelected, setAllSelected] = useState(false);
	const [selectedItemsAmount, setSelectedItemsAmount] = useState(0);

	const { myExamsIcon } = pageIcons;
	const { examEditIcon, downloadIcon, newExamIcon } = buttonIcons;
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
				const updatedArray = items.map(exam => {
					exam.selected = false;
					setAllSelected(false);
					return exam;
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
			const formattedData = data.map(exam => ({ ...exam, selected: false }));
			setItems(formattedData);
		} catch (error) {
			const errorMessage = error.response.data.error;
			showMessage({
				message: errorMessage ? errorMessage : 'Ocorreu um erro ao tentar listar os exames',
				type: 'danger',
				icon: 'danger',
			});
			setHasError(true);
		} finally {
			setLoading(false);
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

	function onPressCard(elementIndex: number) {
		if (multiSelect) {
			const updatedArray = items.map((exam, i) => {
				if (i === elementIndex) {
					exam.selected = !exam.selected;
				}
				return exam;
			});

			countSelectedItems(updatedArray);
		} else {
			setSelectedExam(items[elementIndex]);
			setShowModal(true);
		}
	}

	function onEditButtonPressed() {
		setShowModal(false);
		navigation.navigate('ExamDetails', { id: selectedExam.id });
	}

	async function onDownloadButtonPressed() {
		setShowModal(false);
		setLoading(true);
		downloadFile();
	}

	async function downloadFile() {
		const serverUrl = api.defaults.baseURL;
		const token = api.defaults.headers.Authorization;
		const url = `${serverUrl}/exam/examFile/${selectedExam.id}?authorization=${token}`;
		try {
			await Linking.canOpenURL(url);
			Linking.openURL(url);
			setLoading(false);
		} catch (error) {
			showMessage({
				message: 'Desculpe, não consegui abrir o link para o download',
				icon: 'danger',
				type: 'danger',
			});
		}
	}

	function onPressFloatButton() {
		navigation.navigate('NewExam');
	}

	function onPressSelectAllItems() {
		const updatedArray = items.map(exam => {
			if (!allSelected) {
				exam.selected = true;
				setAllSelected(true);
			} else {
				exam.selected = false;
				setAllSelected(false);
			}
			return exam;
		});
		setItems(updatedArray);
		countSelectedItems(updatedArray);
	}

	function onCancelSelectionItems() {
		setMultiSelect(false);
		setShowTabBar(true);
		setSelectedItemsAmount(0);
	}

	async function onDeleteItems() {
		const itemsSelected = items.filter(exam => exam.selected).map(exam => exam.id);
		setLoading(true);
		try {
			await deleteMany(itemsSelected);
			getData();
			showMessage({
				message: 'Exames excluídas com sucesso!',
				type: 'success',
				icon: 'success',
			});
		} catch (error) {
			showMessage({
				message: 'Não consegui excluir os exames, pode tentar de novo?',
				type: 'danger',
				icon: 'danger',
			});
		} finally {
			onCancelSelectionItems();
		}
	}

	function onLongPressCard(firstElementIndex: number) {
		setMultiSelect(true);
		setShowTabBar(false);
		const updatedArray = items.map((exam, i) => {
			if (i === firstElementIndex) {
				exam.selected = true;
				setSelectedItemsAmount(selectedItemsAmount + 1);
			}
			return exam;
		});
		setItems(updatedArray);
	}

	function countSelectedItems(updatedArray: MultiSelectItems[]) {
		const selectedAmount = updatedArray.filter(item => item.selected).length;
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
						<Text style={styles.title}>Meus exames</Text>
						<View style={styles.scrollContainer}>
							<ScrollView style={styles.scroll} refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}>
								{items.map((item, i) => (
									<Card key={i} style={[styles.card, styles.shadow]} onLongPress={() => onLongPressCard(i)} onPress={() => onPressCard(i)}>
										<View style={styles.textContainer}>
											<Text style={styles.itemName}>{item.name}</Text>
											<Text style={styles.itemDate}>Criado em: {DateTimeToBrDate(item.createdAt)}</Text>
										</View>
										{!multiSelect && myExamsIcon}
										{multiSelect && (
											<CheckBox value={item.selected} tintColors={{ true: colors.darkBlue, false: colors.blue }} disabled={true} />
										)}
									</Card>
								))}
							</ScrollView>
						</View>

						<ModalComponent showModal={showModal} close={() => setShowModal(false)}>
							<View style={styles.modalContainer}>
								<Button buttonText='Baixar Exame' icon={downloadIcon} onPress={onDownloadButtonPressed} />
								<Button buttonText='Editar Exame' icon={examEditIcon} style={styles.lastButton} onPress={onEditButtonPressed} />
							</View>
						</ModalComponent>
					</MultiItems>
				</>
			)}
			{!multiSelect && <FloatButton icon={newExamIcon} style={styles.floatButton} onPress={onPressFloatButton} />}

			{loading && <LoadingComponent />}
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

	itemName: {
		fontFamily: 'Poppins-Regular',
		fontSize: 17,
	},

	itemDate: {
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
});

export default ExamScreen;
