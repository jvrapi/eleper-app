import React, { useEffect, useState } from 'react';
import CheckBox from '@react-native-community/checkbox';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { pageIcons } from '../../assets/icons';
import { colors } from '../../assets/styles';

export interface MultiSelectItems {
	id: string;
	name: string;
	selected: boolean;
}

interface Props {
	listItems: MultiSelectItems[];
	inputLabelText: string;
	onSelectedItem(itemId: string): void;
}

const MultiSelectComponent: React.FC<Props> = ({ listItems, inputLabelText, onSelectedItem }) => {
	const { searchIcon } = pageIcons;
	const [inputValue, setInputValue] = useState('');
	const [items, setItems] = useState(listItems);

	function selectedItem(itemId: string) {
		onSelectedItem(itemId);
		setInputValue('');
	}

	function onSearch(value: string) {
		if (value) {
			const searchItems = listItems.filter(item => item.name.toLocaleLowerCase().includes(value));
			setItems(searchItems);
		} else {
			setItems(listItems);
		}
	}

	useEffect(() => {
		setItems(listItems);
	}, [listItems]);

	return (
		<View style={styles.container}>
			<View style={[styles.inputContainer, styles.shadow]}>
				{searchIcon}
				<TextInput
					style={styles.input}
					placeholder={inputLabelText}
					placeholderTextColor='#a9a9a9'
					value={inputValue}
					onChangeText={value => {
						onSearch(value);
						setInputValue(value);
					}}
				/>
			</View>

			<ScrollView style={[styles.scroll, styles.shadow]}>
				{items.map((item, i) => (
					<View key={i} style={styles.itemsContainer}>
						<CheckBox
							value={item.selected}
							tintColors={{ true: colors.darkBlue, false: colors.blue }}
							onValueChange={() => selectedItem(item.id)}
						/>
						<Text style={styles.itemText}>{item.name}</Text>
					</View>
				))}
			</ScrollView>
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
	inputContainer: {
		width: '100%',
		height: 60,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#ffffff',
		borderTopRightRadius: 10,
		borderTopLeftRadius: 10,
		borderBottomColor: '#000000',
		borderBottomWidth: 0.3,
		padding: 5,
	},
	input: {
		flex: 1,
		fontSize: 14,
		marginLeft: 10,
		fontFamily: 'Poppins-Regular',
	},
	scroll: {
		backgroundColor: '#ffffff',
		width: '100%',
		borderBottomRightRadius: 10,
		borderBottomLeftRadius: 10,
		shadowColor: '#000',
		padding: 10,
	},

	itemsContainer: {
		alignItems: 'center',
		flexDirection: 'row',
	},

	itemText: {
		marginVertical: 5,
		fontFamily: 'Poppins-Regular',
	},

	shadow: {
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 4.65,

		elevation: 8,
	},
});

export default MultiSelectComponent;
