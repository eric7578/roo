import React, {useState, useReducer, useCallback} from 'react';
import styled from 'styled-components';
import {Input, Button} from './Form';
import {useTokens} from '../hooks/useStorage';

function reducer(state, action) {
  switch (action.type) {
    case 'append':
      return [
        ...state,
        {
          name: '',
          value: '',
          selected: false
        }
      ];

    case 'remove':
      return [
        ...state.slice(0, action.index),
        ...state.slice(action.index + 1)
      ];

    case 'modify':
      if (action.field === 'selected' && action.value) {
        return state.map((token, index) => {
          return {
            ...token,
            [action.field]: index === action.index
          };
        });
      }

      state[action.index] = {
        ...state[action.index],
        [action.field]: action.value
      };
      return [...state];

    default:
      return state;
  }
}

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
`;

const DefaultLabel = styled.label`
  color: ${props => props.checked ? '#fafafa' : 'inherit'};
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
  const onFocus = useCallback(e => {
    setIsFocus(true);
  }, [setIsFocus]);
  const onBlur = useCallback(e => {
    setIsFocus(false);
  }, [setIsFocus]);

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
}

const ButtonWrapper = styled.div`
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
  padding: 18px;
  z-index: 1;

  ${Button}:not(:first-child) {
    margin-left: 5px;
  }
`;

const Auth = props => {
  const {tokens, setTokens} = useTokens();
  const [state, dispatch] = useReducer(reducer, tokens);

  return (
    <form
      autoComplete='off'
      onSubmit={e => {
        e.preventDefault();
        const tokens = state.filter(token => token.name && token.value);
        setTokens(tokens);
      }}
    >
      <Wrapper>
        <AuthList>
          {state.map((token, index) =>
            <AuthItem key={index}>
              <Input
                placeholder='Insert name...'
                value={token.name}
                onChange={e => dispatch({
                  type: 'modify',
                  index,
                  field: 'name',
                  value: e.target.value
                })}
              />
              <Token
                placeholder='Insert token...'
                value={token.value}
                onChange={e => dispatch({
                  type: 'modify',
                  index,
                  field: 'value',
                  value: e.target.value
                })}
              />
              <DefaultLabel checked={token.selected}>
                <DefaultCheck
                  type='checkbox'
                  checked={token.selected}
                  onChange={e => dispatch({
                    type: 'modify',
                    index,
                    field: 'selected',
                    value: e.target.checked
                  })}
                />
                Default
              </DefaultLabel>
              <Button
                value='Remove'
                onClick={e => dispatch({
                  type: 'remove',
                  index
                })}
              />
            </AuthItem>
          )}
        </AuthList>
        <ButtonWrapper>
          <Button
            type='submit'
            value='Save'
          />
          <Button
            value='Add token'
            onClick={e => dispatch({
              type: 'append'
            })}
          />
        </ButtonWrapper>
      </Wrapper>
    </form>
  );
}

export default Auth;
