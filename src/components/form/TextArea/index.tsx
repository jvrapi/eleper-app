import React from 'react';
import { StyleSheet, Text, TextInputProps, View, TextInput } from 'react-native';
import { FormikErrors } from 'formik';
import { colors } from '../../../assets/styles';

interface Props extends TextInputProps {
  errors: string | string[] | FormikErrors<any> | FormikErrors<any>[];
  label: string;
  icon?: JSX.Element;
}

const TextArea: React.FC<Props> = ({ label, icon, errors, ...props }) => {
  const { textAreaContainer, textArea, iconContainer } = styles(errors);

  function renderLabel() {
    if (errors) {
      return errors as string;
    }
    return label;
  }
  return (
    <View style={textAreaContainer}>
      <View style={iconContainer}>{icon}</View>
      <TextInput
        style={textArea}
        placeholder={renderLabel()}
        numberOfLines={10}
        multiline={true}
        placeholderTextColor='#8e8e8e'
        {...props}
      />
    </View>
  );
};

export default TextArea;

const styles = (errors: string | string[] | FormikErrors<any> | FormikErrors<any>[]) =>
  StyleSheet.create({
    textAreaContainer: {
      width: '100%',
      borderWidth: 2,
      backgroundColor: colors.white,
      padding: 5,
      borderColor: errors ? colors.danger : '#000000',
      borderRadius: 30,
      alignSelf: 'center',
      marginBottom: 15,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    iconContainer: {
      position: 'absolute',
      top: 50,
      right: 60,
    },
    textArea: {
      height: 200,
      width: 200,
      textAlignVertical: 'top',
      fontSize: 15,
      fontFamily: 'Poppins-Regular',
    },
  });
