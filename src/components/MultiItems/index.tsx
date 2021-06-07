import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { FloatButton } from '..';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface Props {
	multiSelect: boolean;
	allSelected: boolean;
	selectedItemsText: string;
	onPressSelectAllItems(): void;
	onPressCancel(): void;
	onPressDelete(): void;
}

const icon = <AntDesign name='delete' size={30} color='#FFFFFF' />;

const MultiItems: React.FC<Props> = ({
	multiSelect,
	allSelected,
	onPressSelectAllItems,
	onPressCancel,
	onPressDelete,
	selectedItemsText,
	children,
}) => {
	return (
		<View style={styles.container}>
			{multiSelect && (
				<View style={styles.multiSelectContainer}>
					<View style={styles.iconsContainer}>
						<TouchableOpacity onPress={onPressCancel}>
							<FontAwesome5 name='times' size={40} />
						</TouchableOpacity>
						<TouchableOpacity onPress={onPressSelectAllItems}>
							<MaterialCommunityIcons
								name='checkbox-multiple-marked-circle-outline'
								size={40}
								color={allSelected ? '#1064f9' : '#000000'}
							/>
						</TouchableOpacity>
					</View>
					<Text style={styles.multiSelectText}>{selectedItemsText}</Text>
				</View>
			)}
			{children}
			{multiSelect && <FloatButton icon={icon} style={styles.floatButton} onPress={onPressDelete} colorType='danger' />}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
		width: '100%',
	},
	multiSelectContainer: {
		width: '100%',
		paddingHorizontal: 10,
		marginBottom: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	iconsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		paddingHorizontal: 10,
		marginBottom: 20,
	},
	multiSelectText: {
		fontFamily: 'Poppins-SemiBold',
		fontSize: 20,
	},
	floatButton: {
		bottom: 20,
	},
});

export default MultiItems;
