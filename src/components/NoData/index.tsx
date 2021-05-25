import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NoDataIcon from '../../assets/icons/no-data.svg';

const NoData = () => {
	return (
		<View style={styles.container}>
			<NoDataIcon width='150' height='150' fill='#bbb' />
			<Text style={styles.text}>Nada para mostrar</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		fontFamily: 'Poppins-SemiBold',
		fontSize: 19,
		marginTop: 10,
		color: '#aaa',
	},
});

export default NoData;
