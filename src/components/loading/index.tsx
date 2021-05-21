import React from 'react';
import { ActivityIndicator, ActivityIndicatorProps } from 'react-native';
import { colors } from '../../assets/styles';

const LoadingComponent: React.FC<ActivityIndicatorProps> = ({ ...props }) => {
  return <ActivityIndicator size='large' color={props.color ? props.color : colors.black} {...props} />;
};

export default LoadingComponent;
