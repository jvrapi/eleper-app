import styled from 'styled-components/native';
import { ScreenColor } from '../../assets/styles';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  background: ${ScreenColor};
  align-items: center;
  padding: 10px;
`;

export const Scroll = styled.ScrollView`
  flex: 1;
`;

export const Title = styled.Text`
  font-size: 25px;
  font-weight: bold;
`;

export const SubTitle = styled.Text`
  font-weight: bold;
`;
