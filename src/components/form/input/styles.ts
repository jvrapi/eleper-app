import { FormikErrors } from 'formik';
import styled from 'styled-components/native';
import { InputColor } from '../../../assets/styles';

interface Props {
  inputErrors: string | string[] | FormikErrors<any> | FormikErrors<any>[];
}

export const InputArea = styled.View<Props>`
  width: 100%;
  height: 60px;
  background-color: ${InputColor};
  flex-direction: row;
  border-radius: 30px;
  padding-left: 15px;
  padding-right: 15px;
  align-items: center;
  margin-bottom: 15px;
  border: 2px solid ${props => (props.inputErrors ? '#ec392f' : '#000000')};
  margin-top: 30px;
`;

export const Input = styled.TextInput`
  flex: 1;
  font-size: 16px;
  margin-left: 10px;
`;
