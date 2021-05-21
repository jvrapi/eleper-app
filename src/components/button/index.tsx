import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import LoadingComponent from '../Loading';
import { colors } from '../../assets/styles';
import { TouchableOpacity, TouchableOpacityProps, Text, StyleSheet, View } from 'react-native';

interface Props extends TouchableOpacityProps {
  loading?: boolean;
  buttonText: string;
  icon?: JSX.Element;
  colorType?: 'success' | 'danger' | 'waning';
}

const GradientButton: React.FC<Props> = ({ loading, buttonText, icon, colorType, ...props }) => {
  const stylesProps = StyleSheet.create({
    textColor: { color: props.disabled ? '#516267' : colors.white },
  });

  const IconComponent = icon;

  function defineButtonColors() {
    if (colorType === 'success') {
      return colors.gradientColorsSuccess;
    } else if (colorType === 'danger') {
      return colors.gradientColorsDanger;
    } else if (colorType === 'waning') {
      return colors.gradientColorsWarning;
    } else {
      return colors.gradientColorsActive;
    }
  }

  return (
    <TouchableOpacity disabled={loading} {...props} style={[styles.button, props.style]}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        colors={props.disabled ? colors.gradientColorsDisable : defineButtonColors()}
        style={styles.linearGrandient}
      >
        {IconComponent && !loading && <View style={styles.iconContainer}>{IconComponent}</View>}
        {!loading && <Text style={[styles.text, stylesProps.textColor]}>{buttonText}</Text>}
        {loading && <LoadingComponent color='#fff' />}
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
    marginRight: 30,
  },
});

export default GradientButton;
