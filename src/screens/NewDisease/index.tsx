import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, globalStyles } from '../../assets/styles';
import { pageIcons, buttonIcons } from '../../assets/icons';
import { Button, MultiSelect, LoadingComponent, ErrorComponent } from '../../components';
import { MultiSelectItems } from '../../components/MultiSelect';

import { getUnrecordedDiseases, saveMany } from '../../services/user.disease';

import { showMessage } from 'react-native-flash-message';
import AuthContext from '../../contexts/auth';

const NewDisease = () => {
  const [items, setItems] = useState<MultiSelectItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { user } = useContext(AuthContext);
  const { newDiseaseIcon } = pageIcons;
  const { checkIcon } = buttonIcons;

  function onSelectedItem(itemId: string) {
    const arrayFormatted = items.map(item => {
      if (item.id === itemId) {
        item.selected = !item.selected;
      }
      return item;
    });

    setItems(arrayFormatted);
  }

  async function getDiseases() {
    try {
      const { data } = await getUnrecordedDiseases(user?.id as string);
      const formattedData = data.map(disease => ({ ...disease, selected: false }));

      setItems(formattedData);
    } catch (error) {
      setHasError(true);
      showMessage({
        message: 'Não consegui recuperar a lista de doenças, pode tentar de novo?',
        type: 'danger',
        icon: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit() {
    const itemsSelected = items
      .filter(item => item.selected)
      .map(disease => ({
        userId: user?.id as string,
        diseaseId: disease.id,
      }));
    if (itemsSelected.length === 0) {
      showMessage({
        message: 'Ops! Você precisa selecionar alguma doença para continuar',
        type: 'warning',
        icon: 'warning',
      });
    }

    try {
      await saveMany(itemsSelected);
      showMessage({
        message: 'Suas doenças foram atualizadas!',
        type: 'success',
        icon: 'success',
      });
      getDiseases();
    } catch (error) {
      setLoading(false);
      showMessage({
        message: 'Ops! Ocorreu algum erro quando eu tentei cadastrar seus dados. Pode tentar de novo?',
        type: 'danger',
        icon: 'danger',
      });
    }
  }

  useEffect(() => {
    getDiseases();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {!loading && !hasError && (
        <>
          <View style={styles.header}>
            <View style={globalStyles.iconContainer}>{newDiseaseIcon}</View>
            <Text style={styles.title}>Novo Exame</Text>
          </View>
          <View style={styles.scroll}>
            <MultiSelect listItems={items} inputLabelText='Toque aqui para listar as doenças' onSelectedItem={onSelectedItem} />
          </View>

          <View style={styles.Button}>
            <Button buttonText='Registrar doenças' icon={checkIcon} onPress={onSubmit} />
          </View>
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
  header: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    marginTop: 10,
  },
  scroll: {
    height: 300,
    width: '95%',
    marginVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  Button: {
    marginBottom: 50,
    width: '100%',
    alignItems: 'center',
  },
});

export default NewDisease;
