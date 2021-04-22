import React from 'react';
import { colors } from '../../assets/styles';
import { ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native';

export default () => (
  <SafeAreaView style={styles.container}>
    <ActivityIndicator size='large' color={colors.black} />
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
});
