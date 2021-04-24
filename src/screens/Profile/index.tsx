import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import { colors } from '../../assets/styles';

const Profile = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Profile Screen</Text>
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

export default Profile;
