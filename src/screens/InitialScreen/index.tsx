import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colors } from '../../assets/styles';
import { Button } from '../../components';
import { buttonIcons } from '../../assets/icons';

const InitialScreen: React.FC = () => {
	const navigation = useNavigation();

	const { signInIcon, signUpIcon } = buttonIcons;
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Eliper</Text>
			<View style={styles.buttonArea}>
				<Button onPress={() => navigation.navigate('SignIn')} buttonText='Acessar Conta' icon={signInIcon} />
			</View>
			<View style={styles.buttonArea}>
				<Button onPress={() => navigation.navigate('SignUp')} buttonText='Cadastrar-se' icon={signUpIcon} />
			</View>
		</View>
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
		fontSize: 24,
		fontFamily: 'Poppins-SemiBold',
	},
	buttonArea: {
		marginTop: 30,
		width: '100%',
		alignItems: 'center',
	},
});

export default InitialScreen;
