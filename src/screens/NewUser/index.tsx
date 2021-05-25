import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { buttonIcons } from '../../assets/icons';
import { colors } from '../../assets/styles';
import { Button } from '../../components';
import AuthContext from '../../contexts/auth';

const NewUser = () => {
	const { user } = useContext(AuthContext);
	const navigation = useNavigation();
	const { checkIcon } = buttonIcons;

	function goToRegisterDiseases() {
		navigation.reset({ routes: [{ name: 'NewUserRegisterDisease' }] });
	}

	return (
		<SafeAreaView style={styles.container}>
			<>
				<Text style={styles.title}>
					Olá
					<Text style={styles.boldText}> {user?.name} </Text> {'\n'}
					seja bem-vindo.
				</Text>
				<Text style={styles.subTitle}>
					Eu sou o<Text style={styles.boldText}> Eliper</Text>, {'\n'}
					seu aplicativo pessoal de registros médicos
				</Text>
				<View style={styles.buttonArea}>
					<Button buttonText='Olá Eliper' icon={checkIcon} onPress={goToRegisterDiseases} />
				</View>
			</>
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
		fontSize: 19,
		fontFamily: 'Poppins-Regular',
		textAlign: 'center',
	},
	boldText: {
		fontFamily: 'Poppins-SemiBold',
	},
	subTitle: {
		marginTop: 20,
		fontSize: 17,
		fontFamily: 'Poppins-Regular',
		textAlign: 'center',
	},
	buttonArea: {
		marginTop: 30,
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
	},
	useTermsButton: {
		marginTop: 30,
	},
	useTermsText: {
		fontSize: 17,
		color: colors.blue,
		fontFamily: 'Poppins-SemiBold',
	},
	acceptUseTermText: {
		fontFamily: 'Poppins-SemiBold',
	},

	checkBoxArea: {
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		marginTop: 20,
	},
	submitButton: {
		marginTop: 40,
	},
});

export default NewUser;
