import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../assets/styles';
import { GradientButton } from '../../components';
import Icon from 'react-native-vector-icons/FontAwesome5';

const InitialScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Icon name='node-js' size={30} color='#900' />
      <GradientButton onPress={() => navigation.navigate('SignIn')} buttonText='Acessar Conta' />
      <View style={styles.buttonArea}>
        <GradientButton onPress={() => navigation.navigate('SignUp')} buttonText='Cadastrar-se' />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  buttonArea: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
});

export default InitialScreen;
