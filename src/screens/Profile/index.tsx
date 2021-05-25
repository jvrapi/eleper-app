import React, { useContext, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { pageIcons } from '../../assets/icons';
import { colors, globalStyles } from '../../assets/styles';
import AuthContext from '../../contexts/auth';
import TermsAndConditionsIcon from '../../assets/icons/terms-and-conditions.svg';
import ProfileIcon from '../../assets/icons/profile.svg';
import LogoutIcon from '../../assets/icons/logout.svg';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
	const { signOut, user } = useContext(AuthContext);
	const { userIcon } = pageIcons;
	const navigation = useNavigation();

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<View style={globalStyles.iconContainer}>{userIcon}</View>
				<Text style={styles.title}>{user?.name as string}</Text>
			</View>
			<View style={[styles.shadow, styles.content]}>
				<TouchableWithoutFeedback style={styles.card} onPress={() => navigation.navigate('UserDetails')}>
					<View style={styles.iconContent}>{<ProfileIcon width='35' height='35' fill='#000' />}</View>

					<Text style={styles.cardText}>Meus dados</Text>
				</TouchableWithoutFeedback>

				<TouchableWithoutFeedback style={styles.card}>
					<View style={styles.iconContent}>{<TermsAndConditionsIcon width='30' height='30' fill='#000' />}</View>

					<Text style={styles.cardText}>Termos de uso</Text>
				</TouchableWithoutFeedback>

				<TouchableWithoutFeedback style={styles.card} onPress={signOut}>
					<View style={styles.iconContent}>{<LogoutIcon width='35' height='35' fill='#000' />}</View>

					<Text style={styles.cardText}>Sair</Text>
				</TouchableWithoutFeedback>
			</View>
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

export default Profile;
