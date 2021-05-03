import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../assets/styles';
import { pageIcons } from '../../assets/icons';
const NewExam = () => {
  const { newExamIcon } = pageIcons;
  return (
    <SafeAreaView style={styles.container}>
      <View>
        {newExamIcon}
        <Text>Novo Exam</Text>
      </View>
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
});

export default NewExam;
