import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ModalComponent = () => {
  return (
    <View style={styles.container}>
      <Text>Modal Component</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ModalComponent;
