import styled from 'styled-components/native';
import { ScreenColor } from '../../assets/styles';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  background: ${ScreenColor};
  align-items: center;
`;

export const Title = styled.Text`
  font-family: 'Poppins-SemiBold';
  font-size: 25px;
  color: #000000;
`;

export const SubTitle = styled.Text`
  font-family: 'Poppins-SemiBold';
  width: 240px;
  color: #000000;
`;

export const ForgotPasswordButton = styled.TouchableOpacity`
  margin-top: 30px;
`;

export const ForgotPasswordButtonText = styled.Text`
  font-size: 17px;
  color: #2974fa;
  font-family: 'Poppins-SemiBold';
`;
