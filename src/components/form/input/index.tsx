import { FormikErrors } from 'formik';
import React from 'react';
import { StyleSheet, TextInputProps, View, TextInput } from 'react-native';
import { colors } from '../../../assets/styles';

interface Props extends TextInputProps {
  password?: boolean;

  errors: string | string[] | FormikErrors<any> | FormikErrors<any>[];
  label: string;
}

const InputComponent: React.FC<Props> = ({ password, errors, label, ...props }) => {
  function renderLabel() {
    if (errors) {
      return errors as string;
    }
    return label;
  }
  const { container, input } = styles(errors);
  return (
    <View style={container}>
      <TextInput style={input} placeholder={renderLabel()} secureTextEntry={password} {...props} />
    </View>
  );
};


const styles = (errors: string | string[] | FormikErrors<any> | FormikErrors<any>[]) => StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    borderRadius: 30,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 30,
    borderColor: errors ? colors.error : '#000000',
    borderStyle: 'solid',
    borderWidth: 2,
    backgroundColor: colors.white
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    fontFamily: 'Poppins-Regular',
  }
})

export default InputComponent;
