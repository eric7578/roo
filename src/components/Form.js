import React, {useState} from 'react';
import styled from 'styled-components';

export const Input = styled.input.attrs({type: 'text'})`
  background: none;
  border: none;
  color: #fafafa;
  outline: none;
  padding-left: 5px;
  width: 100%;
`;

export const Token = props => {
  const [type, setType] = useState('password');
  const onFocus = e => {
    setType('text');
  }
  const onBlur = e => {
    setType('password');
  }

  // if type is password use a placeholder 'secretcat' as default value
  return (
    <Input
      {...props}
      value={type === 'password' && props.value ? 'secretcat' : props.value}
      type={type}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
}
