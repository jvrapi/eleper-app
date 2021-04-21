import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import LoadingComponent from '../loading';
import { colors } from '../../assets/styles';
import { TouchableOpacity, TouchableOpacityProps, Text, StyleSheet } from 'react-native';

interface Props extends TouchableOpacityProps {
  loading?: boolean;
  buttonText: string;
}

const GradientButton: React.FC<Props> = ({ loading, buttonText, ...rest }) => (
  <TouchableOpacity disabled={loading} style={styles.button} {...rest}>
    <LinearGradient
      start={{ x: 0, y: 0 }}
      colors={colors.gradientColors}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
      }}
    >
      {!loading && <Text style={styles.text}>{buttonText}</Text>}
      {loading && <LoadingComponent />}
    </LinearGradient>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    height: 60,
    width: '70%'
  },
  text: {
    fontFamily: 'Poppins-Regular',
    color: colors.white,
    fontSize: 18,
  }
})

export default GradientButton;
