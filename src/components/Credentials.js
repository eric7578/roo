import React, { useState, useCallback, useContext } from 'react';
import styled from 'styled-components';
import produce from 'immer';
import { Input, Button } from './Form';
import { Context as StorageContext } from './Storage';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const DefaultLabel = styled.label`
  color: ${props => (props.checked ? '#fafafa' : 'inherit')};
  flex: 1;
  font-size: 10px;
`;

const DefaultCheck = styled.input.attrs({
  type: 'checkbox'
})`
  margin-right: 5px;
`;

const AuthList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  flex: 1;
  overflow-y: auto;
  padding: 18px;
`;

const AuthItem = styled.li`
  align-items: center;
  display: flex;
  flex-wrap: wrap;

  &:not(:first-child) {
    margin-top: 25px;
  }

  & *:not(:first-child) {
    margin-top: 8px;
  }
`;

const Token = props => {
  const [isFocus, setIsFocus] = useState(false);
  const onFocus = useCallback(
    e => {
      setIsFocus(true);
    },
    [setIsFocus]
  );
  const onBlur = useCallback(
    e => {
      setIsFocus(false);
    },
    [setIsFocus]
  );

  // if type is password use a placeholder 'secretcat' as default value
  return (
    <Input
      {...props}
      placeholder={props.value ? 'Focus here to reveal' : props.placeholder}
      value={isFocus ? props.value : ''}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};

const ButtonWrapper = styled.div`
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
  padding: 18px;
  z-index: 1;

  ${Button}:not(:first-child) {
    margin-left: 5px;
  }
`;

export default function Credentials(props) {
  const { tokens, setTokens } = useContext(StorageContext);
  const [values, setValues] = useState(tokens);

  const onAppend = useCallback(() => {
    setValues(
      produce(values => {
        values.push({
          selected: false,
          value: '',
          created: Date.now()
        });
      })
    );
  }, []);

  const onRemove = useCallback(index => {
    setValues(
      produce(values => {
        values.splice(index, 1);
      })
    );
  }, []);

  const onChange = useCallback((index, field, value) => {
    setValues(
      produce(values => {
        values[index] = {
          ...values[index],
          [field]: value
        };
      })
    );
  }, []);

  return (
    <Form
      autoComplete='off'
      onSubmit={e => {
        e.preventDefault();
        setTokens(values.filter(token => !!token.value));
      }}
    >
      <AuthList>
        {values.map((token, index) => (
          <AuthItem key={index}>
            <Token
              placeholder='Insert token...'
              value={token.value}
              onChange={e => onChange(index, 'value', e.target.value)}
            />
            <DefaultLabel checked={token.selected}>
              <DefaultCheck
                type='checkbox'
                checked={token.selected}
                onChange={e => onChange(index, 'selected', !token.selected)}
              />
              Default
            </DefaultLabel>
            <Button value='Remove' onClick={e => onRemove(index)} />
          </AuthItem>
        ))}
      </AuthList>
      <ButtonWrapper>
        <Button type='submit' value='Save' />
        <Button value='Add token' onClick={onAppend} />
      </ButtonWrapper>
    </Form>
  );
}
