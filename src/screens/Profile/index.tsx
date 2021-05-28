import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { buttonIcons, pageIcons } from '../../assets/icons';
import { colors, globalStyles } from '../../assets/styles';
import AuthContext from '../../contexts/auth';
import TermsAndConditionsIcon from '../../assets/icons/terms-and-conditions.svg';
import ProfileIcon from '../../assets/icons/profile.svg';
import LogoutIcon from '../../assets/icons/logout.svg';
import TrashIcon from '../../assets/icons/trash.svg';
import { useNavigation } from '@react-navigation/native';
import { Button, ModalComponent } from '../../components';
import { deleteAccount } from '../../services/user';
import { showMessage } from 'react-native-flash-message';

const Profile = () => {
	const { signOut, user } = useContext(AuthContext);
	const { userIcon } = pageIcons;
	const navigation = useNavigation();
	const [showModal, setShowModal] = useState(false);
	const { checkIcon, cancelIcon } = buttonIcons;
	const [loading, setLoading] = useState(false);

	async function onPressDeleteAccount() {
		setLoading(true);
		setShowModal(false);
		try {
			await deleteAccount(user?.id as string);
			showMessage({
				message: 'Conta excluída com sucesso',
				type: 'success',
				icon: 'success',
			});
			signOut();
		} catch {
			showMessage({
				message: 'Erro ao tentar excluir a sua conta, pode tentar de novo?',
				type: 'danger',
				icon: 'danger',
			});
			setLoading(false);
		}
	}

	function logout() {
		showMessage({
			message: 'Deslogado com sucesso',
			type: 'success',
			icon: 'success',
		});
		signOut();
	}

	return (
		<>
			<SafeAreaView style={styles.container}>
				{!loading && (
					<>
						<View style={styles.header}>
							<View style={globalStyles.iconContainer}>{userIcon}</View>
							<Text style={styles.title}>{user?.name as string}</Text>
						</View>
						<View style={[styles.shadow, styles.content]}>
							<TouchableWithoutFeedback style={styles.card} onPress={() => navigation.navigate('UserDetails')}>
								<View style={styles.iconContent}>{<ProfileIcon width='35' height='35' fill='#000' />}</View>

								<Text style={styles.cardText}>Meus dados</Text>
							</TouchableWithoutFeedback>

							<TouchableWithoutFeedback style={styles.card} onPress={() => setShowModal(true)}>
								<View style={styles.iconContent}>{<TrashIcon width='30' height='30' fill='#000' />}</View>

								<Text style={styles.cardText}>Excluir conta</Text>
							</TouchableWithoutFeedback>

							<TouchableWithoutFeedback style={styles.card} onPress={logout}>
								<View style={styles.iconContent}>{<LogoutIcon width='35' height='35' fill='#000' />}</View>

								<Text style={styles.cardText}>Sair</Text>
							</TouchableWithoutFeedback>
						</View>
					</>
				)}
			</SafeAreaView>
			<ModalComponent showModal={showModal} close={() => setShowModal(false)}>
				<View style={modalStyles.container}>
					<Text style={modalStyles.headerText}>Atenção!</Text>
					<Text style={modalStyles.bodyText}>
						Ao excluir a sua conta, todos os dados e arquivos que foram armazenados aqui serão perdidos permanentemente.{'\n'}Tem certeza
						que quer excluir a sua conta?
					</Text>
					<View style={modalStyles.buttonsContainer}>
						<Button
							onPress={onPressDeleteAccount}
							buttonText='Sim'
							style={[modalStyles.button, modalStyles.firstButton]}
							icon={checkIcon}
							colorType='danger'
						/>

						<Button onPress={() => setShowModal(false)} buttonText='Não' style={modalStyles.button} icon={cancelIcon} colorType='success' />
					</View>
				</View>
			</ModalComponent>
		</>
	);
};

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

	content: {
		width: '100%',
		paddingHorizontal: 20,
	},

	iconContent: {
		marginRight: 10,
	},
	card: {
		backgroundColor: '#fff',
		width: '100%',
		height: 50,
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginBottom: 5,
		borderRadius: 5,
		flexDirection: 'row',
		paddingHorizontal: 10,
	},
	cardText: {
		fontFamily: 'Poppins-SemiBold',
		fontSize: 20,
	},

	shadow: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 4.65,

		elevation: 8,
	},
});

const modalStyles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-around',
	},

	headerText: {
		fontFamily: 'Poppins-SemiBold',
		textAlign: 'center',
		fontSize: 27,
		marginVertical: 20,
		color: colors.danger,
	},

	bodyText: {
		fontFamily: 'Poppins-Regular',
		textAlign: 'center',
		fontSize: 15,
	},

	buttonsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},

	button: {
		width: 150,
	},

	firstButton: {
		marginRight: 20,
	},
});

export default Profile;
