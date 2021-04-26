import React, { useContext, useState } from 'react';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, SafeAreaView, View } from 'react-native';
import Icons from '../../assets/icons';
import { colors } from '../../assets/styles';
import { GradientButton } from '../../components';
import AuthContext from '../../contexts/auth';

const NewUser = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const { checkIcon } = Icons;
  const [showInitialScreen, setShowInitialScreen] = useState(true);
  const [checkBox, setCheckBox] = useState(false);

  function goToRegisterDiseases() {
    navigation.reset({ routes: [{ name: 'NewUserRegisterDisease' }] });
  }

  return (
    <SafeAreaView style={styles.container}>
      {showInitialScreen && (
        <>
          <Text style={styles.title}>
            Olá
            <Text style={styles.boldText}> {user?.name} </Text> {'\n'}
            seja bem-vindo.
          </Text>
          <Text style={styles.subTitle}>
            Eu sou o<Text style={styles.boldText}> Eliper</Text>, {'\n'}
            seu aplicativo pessoal de registros médicos
          </Text>
          <View style={styles.buttonArea}>
            <GradientButton buttonText='Olá Eliper' icon={checkIcon} onPress={() => setShowInitialScreen(false)} />
          </View>
        </>
      )}
      {!showInitialScreen && (
        <>
          <Text style={styles.title}>Antes de continuar, preciso que você leia os nossos termos de uso</Text>
          <TouchableOpacity style={styles.useTermsButton}>
            <Text style={styles.useTermsText}>Termos de uso</Text>
          </TouchableOpacity>
          <View style={styles.checkBoxArea}>
            <CheckBox
              value={checkBox}
              onValueChange={newValue => setCheckBox(newValue)}
              tintColors={{ true: colors.darkBlue, false: colors.blue }}
            />
            <Text style={styles.acceptUseTermText}>Li e aceito os termos de uso</Text>
          </View>
          <View style={styles.buttonArea}>
            <GradientButton buttonText='Continuar' disabled={!checkBox} onPress={goToRegisterDiseases} icon={checkIcon} />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.screenColor,
  },
  title: {
    fontSize: 19,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  boldText: {
    fontFamily: 'Poppins-SemiBold',
  },
  subTitle: {
    marginTop: 20,
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  buttonArea: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  useTermsButton: {
    marginTop: 30,
  },
  useTermsText: {
    fontSize: 17,
    color: colors.blue,
    fontFamily: 'Poppins-SemiBold',
  },
  acceptUseTermText: {
    fontFamily: 'Poppins-SemiBold',
  },

  checkBoxArea: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },
});

export default NewUser;
