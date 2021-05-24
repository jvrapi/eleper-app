import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';

interface Props extends TouchableOpacityProps {
	style?: StyleProp<ViewStyle>;
}

const Card: React.FC<Props> = ({ children, ...props }) => {
	return (
		<TouchableOpacity {...props} style={[props.style, styles.container]}>
			{children}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: 100,
		backgroundColor: '#ffffff',
		borderRadius: 30,
	},
});

export default Card;
