import styled from 'styled-components/native';
import { ScreenColor } from '../../assets/styles';

interface Props {
  textToLong: boolean;
}

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${ScreenColor};
`;

export const Title = styled.Text`
  font-family: 'Nunito-ExtraBold';
  font-size: 25px;
  font-weight: bold;
`;

export const SubTitle = styled.Text<Props>`
  font-family: 'Nunito-ExtraBold';
  width: 240px;
  margin-left: ${props => (props.textToLong ? '0' : '100px')};
`;
