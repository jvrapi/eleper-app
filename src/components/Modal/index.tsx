import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Keyboard, StyleSheet, View } from 'react-native';
import FaIcons from 'react-native-vector-icons/FontAwesome';

interface Props {
  showModal: boolean;
  close(): void;
}
const { height } = Dimensions.get('window');

const ModalComponent: React.FC<Props> = ({ showModal, close, children }) => {
  const [state, setState] = useState({
    opacity: new Animated.Value(0),
    container: new Animated.Value(height),
    modal: new Animated.Value(height),
  });

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const { container, modal, indicatorContainer, indicator, header, icon } = styles(isKeyboardVisible);

  function openModal() {
    Animated.sequence([
      Animated.timing(state.container, { toValue: 0, duration: 100, useNativeDriver: true }),
      Animated.timing(state.opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(state.modal, { toValue: 0, bounciness: 5, useNativeDriver: true }),
    ]).start();
  }

  function closeModal() {
    Animated.sequence([
      Animated.timing(state.modal, { toValue: height, duration: 250, useNativeDriver: true }),
      Animated.timing(state.opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(state.container, { toValue: height, duration: 100, useNativeDriver: true }),
    ]).start();
    close();
  }

  useEffect(() => {
    if (showModal) {
      openModal();
    } else {
      closeModal();
    }
  }, [showModal]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <Animated.View
      style={[
        container,
        {
          opacity: state.opacity,
          transform: [{ translateY: state.container }],
        },
      ]}
    >
      <Animated.View style={[modal, { transform: [{ translateY: state.modal }] }]}>
        <View style={header}>
          <View style={indicatorContainer}>
            <View style={indicator} />
          </View>
          <FaIcons name='times-circle-o' size={30} color='#000000' style={icon} onPress={closeModal} />
        </View>

        {children}
      </Animated.View>
    </Animated.View>
  );
};

const styles = (isKeyboardVisible: boolean) =>
  StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    modal: {
      position: 'absolute',
      height: isKeyboardVisible ? '80%' : '50%',
      backgroundColor: '#fff',
      width: '100%',
      borderRadius: 20,
      paddingHorizontal: 25,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    indicatorContainer: {
      width: '100%',
    },
    indicator: {
      width: 50,
      height: 5,
      backgroundColor: '#ccc',
      borderRadius: 50,
      alignSelf: 'center',
      marginTop: 5,
    },
    icon: {
      marginTop: 5,
    },
    btn: {
      width: '100%',
      height: 50,
      borderRadius: 10,
      backgroundColor: '#9b59b6',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default ModalComponent;
