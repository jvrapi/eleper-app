import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NoData = () => {
	return (
		<View style={styles.container}>
			<Text>No Data Component</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default NoData;
