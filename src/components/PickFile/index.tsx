import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { inputIcons } from '../../assets/icons';
import DocumentPicker from 'react-native-document-picker';
import { showMessage } from 'react-native-flash-message';
import { FormikErrors } from 'formik';
import { colors } from '../../assets/styles';

export interface FileProps {
  uri: string;
  name: string;
}

interface Props extends TouchableOpacityProps {
  onFileSelected(fileProps: FileProps): void;
  fileName: string;
  errors: string | string[] | FormikErrors<any> | FormikErrors<any>[];
}

const PickFile: React.FC<Props> = ({ onFileSelected, fileName, errors, ...props }) => {
  const { pdfIcon } = inputIcons;

  const { container, card, fileNameText } = styles(errors, fileName);

  async function onPress() {
    try {
      const { uri, name } = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

      onFileSelected({ uri, name });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        showMessage({
          message: 'Não consegui carregar o arquivo que você escolheu, pode tentar de novo?',
          type: 'danger',
          icon: 'danger',
        });
      } else {
        throw err;
      }
    }
  }

  function renderLabel() {
    if (errors) {
      return errors as string;
    } else if (fileName === '') {
      return 'Escolha um arquivo';
    } else {
      return fileName;
    }
  }

  return (
    <View style={container}>
      <TouchableOpacity style={card} onPress={onPress} activeOpacity={0.5} {...props}>
        {pdfIcon}
        <Text style={fileNameText}>{renderLabel()}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = (errors: string | string[] | FormikErrors<any> | FormikErrors<any>[], fileName: string) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      paddingHorizontal: 10,
      marginTop: 10,
    },
    card: {
      width: '100%',
      backgroundColor: '#fff',
      height: 60,
      flexDirection: 'row',
      borderRadius: 30,
      paddingHorizontal: 15,
      borderColor: errors ? colors.danger : '#000000',
      borderStyle: 'solid',
      borderWidth: 2,
      alignItems: 'center',
    },
    fileNameText: {
      fontFamily: 'Poppins-Regular',
      marginLeft: 10,
      color: fileName === '' ? '#8e8e8e' : '#000000',
    },
  });

export default PickFile;
