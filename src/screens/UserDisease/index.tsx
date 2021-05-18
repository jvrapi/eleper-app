import React, { useContext, useEffect, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View, BackHandler } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { colors } from '../../assets/styles';
import { Card, ErrorComponent, FloatButton, LoadingComponent, MultiItems, NoDataComponent } from '../../components';
import AuthContext from '../../contexts/auth';
import { UserDisease } from '../../interfaces/user.disease';
import { getUserDiseases, deleteMany } from '../../services/user.disease';
import { DateTimeToBrDate } from '../../utils/function';
import { buttonIcons, pageIcons } from '../../assets/icons';
import { useNavigation } from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import BottomTabBarContext from '../../contexts/bottomTabBar';

interface MultiSelectItems extends UserDisease {
  selected: boolean;
}

const Disease: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { setShowTabBar } = useContext(BottomTabBarContext);
  const [items, setItems] = useState<MultiSelectItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [multiSelect, setMultiSelect] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const [selectedItemsAmount, setSelectedItemsAmount] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    getData();
    navigation.addListener('focus', () => {
      getData();
    });
  }, []);

  useEffect(() => {
    function backAction() {
      if (multiSelect) {
        const updatedArray = items.map(item => {
          item.selected = false;
          setAllSelected(false);
          return item;
        });
        setItems(updatedArray);
        countSelectedItems(updatedArray);
        onCancelSelectionItems();
        return true;
      } else {
        return false;
      }
    }
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, [multiSelect, items]);

  async function getData() {
    try {
      const { data } = await getUserDiseases(user?.id as string);
      const formattedData = data.map(userDisease => ({ ...userDisease, selected: false }));
      setItems(formattedData);
    } catch {
      setHasError(true);
      showMessage({
        message: 'Não consegui carregar a lista com as suas doenças',
        type: 'danger',
        icon: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    setLoading(true);
    await getData();
    showMessage({
      message: 'Lista atualizada!',
      type: 'success',
      icon: 'success',
    });
  }

  async function onDeleteItems() {
    const itemsSelected = items.filter(item => item.selected).map(item => item.id);
    setLoading(true);
    try {
      await deleteMany(itemsSelected);
      getData();
      showMessage({
        message: 'Doenças excluídas com sucesso!',
        type: 'success',
        icon: 'success',
      });
    } catch {
      showMessage({
        message: 'Não consegui excluir as doenças, pode tentar de novo?',
        type: 'danger',
        icon: 'danger',
      });
    } finally {
      onCancelSelectionItems();
    }
  }

  function onPressFloatButton() {
    navigation.navigate('NewDisease');
  }

  function onLongPressCard(firstElementIndex: number) {
    setMultiSelect(true);
    setShowTabBar(false);
    const updatedArray = items.map((item, i) => {
      if (i === firstElementIndex) {
        item.selected = true;
        setSelectedItemsAmount(selectedItemsAmount + 1);
      }
      return item;
    });
    setItems(updatedArray);
  }

  function onPressCard(elementIndex: number) {
    if (multiSelect) {
      const updatedArray = items.map((item, i) => {
        if (i === elementIndex) {
          item.selected = !item.selected;
        }
        return item;
      });

      countSelectedItems(updatedArray);
    } else {
      navigation.navigate('UserDiseaseDetails', { id: items[elementIndex].id });
    }
  }

  function onPressSelectAllItems() {
    const updatedArray = items.map(item => {
      if (!allSelected) {
        item.selected = true;
        setAllSelected(true);
      } else {
        item.selected = false;
        setAllSelected(false);
      }
      return item;
    });
    setItems(updatedArray);
    countSelectedItems(updatedArray);
  }

  function countSelectedItems(updatedArray: MultiSelectItems[]) {
    const selectedAmount = updatedArray.filter(userDisease => userDisease.selected).length;
    if (selectedAmount === 0) {
      setSelectedItemsAmount(selectedAmount);
    } else {
      if (selectedAmount === items.length) {
        setAllSelected(true);
      } else {
        setAllSelected(false);
      }
      setSelectedItemsAmount(selectedAmount);
      setItems(updatedArray);
    }
  }

  function onCancelSelectionItems() {
    setMultiSelect(false);
    setShowTabBar(true);
    setSelectedItemsAmount(0);
  }

  return (
    <SafeAreaView style={styles.container}>
      {!loading && !hasError && items.length > 0 && (
        <>
          <MultiItems
            multiSelect={multiSelect}
            allSelected={allSelected}
            onPressSelectAllItems={onPressSelectAllItems}
            onPressCancel={onCancelSelectionItems}
            onPressDelete={onDeleteItems}
            itemsAmount={selectedItemsAmount}
            selectedItemsText='Doenças selecionadas'
          >
            <Text style={styles.title}>Minhas doenças</Text>
            <View style={styles.scrollContainer}>
              <ScrollView style={styles.scroll} refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}>
                {items.map((userDisease, i) => (
                  <Card key={i} style={[styles.card, styles.shadow]} onLongPress={() => onLongPressCard(i)} onPress={() => onPressCard(i)}>
                    <View style={styles.textContainer}>
                      <Text style={styles.examName}>{userDisease.disease.name}</Text>
                      <Text style={styles.examDate}>{`Diagnosticada em:  ${DateTimeToBrDate(
                        userDisease.diagnosisDate,
                        'Data não cadastrada',
                      )}`}</Text>
                      <Text>Atualmente {userDisease.active ? 'Ativa' : 'Inativa'}</Text>
                    </View>
                    {!multiSelect && pageIcons.diseaseIcon}
                    {multiSelect && <CheckBox value={userDisease.selected} tintColors={{ true: colors.darkBlue, false: colors.blue }} />}
                  </Card>
                ))}
              </ScrollView>
            </View>
            {!multiSelect && <FloatButton icon={buttonIcons.newDiseaseIcon} style={styles.floatButton} onPress={onPressFloatButton} />}
          </MultiItems>
        </>
      )}
      {loading && <LoadingComponent />}
      {hasError && <ErrorComponent />}
      {!loading && !hasError && items.length === 0 && <NoDataComponent />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.screenColor,
  },

  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
  },
  scrollContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '72%',
  },
  scroll: {
    width: '100%',
    padding: 10,
  },

  card: {
    marginVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 20,
  },
  shadow: {
    shadowColor: '#2974FA',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },

  textContainer: {
    justifyContent: 'center',
  },
  examName: {
    fontFamily: 'Poppins-Regular',
    fontSize: 17,
  },
  examDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
  },

  floatButton: {
    bottom: 100,
    right: 30,
  },
});

export default Disease;
