import React from 'react';
import { ActivityIndicator, ActivityIndicatorProps, StyleSheet } from 'react-native';
import { colors } from '../../assets/styles';

const LoadingComponent: React.FC<ActivityIndicatorProps> = ({ ...props }) => {
	return (
		<ActivityIndicator size='large' color={props.color ? props.color : colors.black} style={[props.style, styles.container]} {...props} />
	);
};
const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
	},
});
export default LoadingComponent;
