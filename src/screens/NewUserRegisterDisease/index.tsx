import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { colors } from '../../assets/styles';
import { ErrorComponent, GradientButton, LoadingComponent, ModalComponent, MultiSelect } from '../../components';
import { MultiSelectItems } from '../../components/MultiSelect';
import { getAll } from '../../services/disease';
import Icons from '../../assets/icons';

const NewUserRegisterDisease = () => {
  const [items, setItems] = useState<MultiSelectItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { checkIcon } = Icons;

  async function getDiseases() {
    try {
      const { data } = await getAll();
      const formattedData = data.map(disease => ({ ...disease, selected: false }));
      setItems(formattedData);
    } catch (error) {
      setHasError(true);
      showMessage({
        message: error.response.data.error,
        type: 'danger',
        icon: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }

  function onSelectedItem(itemId: string) {
    const arrayFormatted = items.map(item => {
      if (item.id === itemId) {
        item.selected = !item.selected;
      }
      return item;
    });

    setItems(arrayFormatted);
  }

  function registerDiseasesTerminated() {
    const itemsSelected = items.filter(item => item.selected);
  }

  useEffect(() => {
    getDiseases();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ModalComponent />
      {!loading && !hasError && (
        <>
          <Text style={styles.title}>Vamos começar</Text>
          <Text style={styles.subTitle}>
            Me informe alguma doença que você ja teve ou tem.
            {'\n'}
            Você pode escolher mais de uma
          </Text>
          <View style={styles.scroll}>
            <MultiSelect listItems={items} inputLabelText='Toque aqui para listar as doenças' onSelectedItem={onSelectedItem} />
          </View>
          <View style={styles.gradientButton}>
            <GradientButton buttonText='Finalizei!' icon={checkIcon} onPress={registerDiseasesTerminated} />
          </View>
          <TouchableOpacity>
            <Text style={styles.diseaseNotFoundButtonText}>Não encontrei a doença</Text>
          </TouchableOpacity>
        </>
      )}
      {loading && <LoadingComponent />}
      {hasError && <ErrorComponent />}
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
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
  },
  subTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    width: 300,
    textAlign: 'center',
    marginTop: 20,
  },
  scroll: {
    height: 400,
    width: '95%',
    marginVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diseaseNotFoundButtonText: {
    fontSize: 17,
    color: colors.blue,
    fontFamily: 'Poppins-SemiBold',
  },
  gradientButton: {
    marginBottom: 30,
    width: '100%',
    alignItems: 'center',
  },
});

export default NewUserRegisterDisease;
