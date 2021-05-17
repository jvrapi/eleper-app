import { FormikErrors } from 'formik';
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { colors } from '../../assets/styles';

interface Props extends TouchableOpacityProps {
  icon: JSX.Element;
  label: string;
  errors: string | string[] | FormikErrors<any> | FormikErrors<any>[];
  value: string;
}

const InputButton: React.FC<Props> = ({ label, errors, icon, value, ...props }) => {
  const { container, card, labelText } = styles(errors, labelColor());

  function renderLabel() {
    if (errors) {
      return errors as string;
    } else if (value) {
      return value;
    } else {
      return label;
    }
  }

  function labelColor() {
    if (value) {
      return '#000000';
    } else {
      return '#8e8e8e';
    }
  }

  return (
    <View style={container}>
      <TouchableOpacity style={card} activeOpacity={0.5} {...props}>
        {icon}
        <Text style={labelText}>{renderLabel()}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = (errors: string | string[] | FormikErrors<any> | FormikErrors<any>[], labelColor: string) =>
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
    labelText: {
      fontFamily: 'Poppins-Regular',
      marginLeft: 10,
      color: labelColor,
      fontSize: 15,
    },
  });

export default InputButton;
