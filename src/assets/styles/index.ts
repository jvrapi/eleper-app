import { StyleSheet } from 'react-native';

export const colors = {
	danger: '#ec392f',
	warning: '#2fec39',
	successful: '#ec982f',
	black: '#000000',
	white: '#FFFFFF',
	gradientColorsActive: ['#43D4FF', '#38ABFD', '#2974FA'],
	gradientColorsDisable: ['#d5dcde', '#aab0b1', '#959a9b'],
	gradientColorsSuccess: ['#97f59c', '#43ed4c', '#2fec39'],
	gradientColorsDanger: ['#f59c97', '#ed4c43', '#ec392f'],
	gradientColorsWarning: ['#f5cb97', '#eda243', '#ec982f'],
	blue: '#2974fa',
	darkBlue: '#0558eb',
	screenColor: '#c3e5fe',
	iconInactive: '#8595b1',
	iconFocused: '#ffffff',
};

export const globalStyles = StyleSheet.create({
	inputArea: {
		paddingHorizontal: 10,
	},
	iconContainer: {
		borderRadius: 100,
		borderWidth: 7,
		borderColor: '#000000',
		backgroundColor: '#ddd',
		width: 120,
		height: 120,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
