import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import LoadingComponent from '../Loading';
import { colors } from '../../assets/styles';
import { TouchableOpacity, TouchableOpacityProps, Text, StyleSheet, View } from 'react-native';

interface Props extends TouchableOpacityProps {
  loading?: boolean;
  buttonText: string;
  icon?: JSX.Element;
}

const GradientButton: React.FC<Props> = ({ loading, buttonText, icon, ...rest }) => {
  const IconComponent = icon;
  return (
    <TouchableOpacity disabled={loading} style={styles.button} {...rest}>
      <LinearGradient start={{ x: 0, y: 0 }} colors={colors.gradientColors} style={styles.linearGrandient}>
        {IconComponent && !loading && <View style={styles.iconContainer}>{IconComponent}</View>}
        {!loading && <Text style={styles.text}>{buttonText}</Text>}
        {loading && <LoadingComponent />}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 60,
    width: '70%',
  },
  text: {
    fontFamily: 'Poppins-SemiBold',
    color: colors.black,
    fontSize: 18,
  },
  linearGrandient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    flexDirection: 'row',
  },
  iconContainer: {
    marginRight: 20,
  },
});

export default GradientButton;
