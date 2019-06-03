import styled from 'styled-components';

export const Input = styled.input.attrs({type: 'text'})`
  background-color: #3c3c3c;
  border: none;
  color: #fafafa;
  outline: none;
  padding: 3px 8px;
  width: 100%;
`;

export const Button = styled.input.attrs({type: 'button'})`
  background: none;
  border: 1px solid #bebebe;
  border-radius: 50px;
  box-sizing: border-box;
  color: #bebebe;
  cursor: pointer;
  font-size: 12px;
  line-height: 20px;
  outline: none;
  transition: .2s;

  &:hover {
    border-color: #fafafa;
    color: #fafafa;
  }
`;
