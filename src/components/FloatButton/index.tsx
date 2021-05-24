import React from 'react';
import { TouchableOpacity, View, TouchableOpacityProps, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { LoadingComponent } from '..';
import { colors } from '../../assets/styles';

interface Props extends TouchableOpacityProps {
	loading?: boolean;
	icon?: JSX.Element | string;
	colorType?: 'success' | 'danger' | 'waning';
}

const FloatButton: React.FC<Props> = ({ loading, icon, colorType, ...props }) => {
	const IconComponent = icon;

	function defineButtonColors() {
		if (colorType === 'success') {
			return colors.gradientColorsSuccess;
		} else if (colorType === 'danger') {
			return colors.gradientColorsDanger;
		} else if (colorType === 'waning') {
			return colors.gradientColorsWarning;
		} else {
			return colors.gradientColorsActive;
		}
	}
	return (
		<View style={[styles.container, props.style]}>
			<TouchableOpacity disabled={loading} {...props} style={styles.button}>
				<LinearGradient colors={props.disabled ? colors.gradientColorsDisable : defineButtonColors()} style={styles.linearGrandient}>
					{IconComponent && !loading && <View style={styles.iconContainer}>{IconComponent}</View>}
					{loading && <LoadingComponent />}
				</LinearGradient>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		position: 'absolute',
	},
	button: {
		height: 80,
		width: 80,
	},
	text: {
		fontFamily: 'Poppins-SemiBold',
		fontSize: 18,
	},
	linearGrandient: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 100,
		flexDirection: 'row',
	},
	iconContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default FloatButton;
