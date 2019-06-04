import React, {useState, useReducer, useContext, useEffect} from 'react';
import styled from 'styled-components';
import {Storage} from '../context';
import {Input, Button} from './Form';

const SET_DEFAULT = 'SET_DEFAULT';
const REMOVE = 'REMOVE';
const MODIFY = 'MODIFY';
const SYNC = 'SYNC';

function reducer(state, action) {
  switch (action.type) {
    case SET_DEFAULT:
      return setDefault(state, action);
    case REMOVE:
      return remove(state, action);
    case MODIFY:
      return modify(state, action);
    case SYNC:
      return sync(action.token);
    default:
      return state;
  }
}

function sync(token) {
  return token.reduce((state, {name, token, selected}, index) => {
    if (selected) {
      state.selected = index;
    }
    state.value.push({name, token});
    return state;
  }, {
    value: [],
    selected: -1
  });
}

function setDefault(state, action) {
  return {
    ...state,
    selected: action.selected ? action.index : -1
  };
}

function remove(state, action) {
  return {
    ...state,
    selected: action.index === state.selected ? -1 : state.selected,
    value: [
      ...state.value.slice(0, action.index),
      ...state.value.slice(action.index + 1)
    ]
  };
}

function modify(state, action) {
  const {index, type, ...auth} = action;
  const nextAuth = [...state.value];
  nextAuth[index] = {
    ...state.value[index],
    ...auth
  };
  return {
    ...state,
    selected: action.selected ? action.index : state.selected,
    value: nextAuth
  };
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

const ButtonWrapper = styled.div`
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
  padding: 18px;
  z-index: 1;

  ${Button}:not(:first-child) {
    margin-left: 5px;
  }
`;

const Auth = props => {
  const {token, setToken} = useContext(Storage);
  const [{value, selected}, dispatch] = useReducer(reducer, token, sync);
  useEffect(() => {
    dispatch({type: SYNC, token})
  }, [token]);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        const token = value.filter(({name, token}) => name && token).map(({name, token}, index) => {
          const t = {name, token};
          if (selected === index) {
            t.selected = true;
          }
          return t;
        });
        setToken(token);
      }}
    >
      <Wrapper>
        <AuthList>
          {value.map(({name, token}, index) =>
            <AuthItem key={index}>
              <Input
                placeholder='Insert name...'
                value={name}
                onChange={e => dispatch({
                  type: MODIFY,
                  index,
                  name: e.target.value
                })}
              />
              <Token
                placeholder='Insert token...'
                value={token}
                onChange={e => dispatch({
                  type: MODIFY,
                  index,
                  token: e.target.value
                })}
              />
              <DefaultLabel checked={index === selected}>
                <DefaultCheck
                  type='checkbox'
                  checked={index === selected}
                  onChange={e => dispatch({
                    type: SET_DEFAULT,
                    index,
                    selected: e.target.checked
                  })}
                />
                Default
              </DefaultLabel>
              <Button
                value='Remove'
                onClick={e => dispatch({
                  type: REMOVE,
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
            value='Add account'
            onClick={e => dispatch({
              type: MODIFY,
              index: value.length,
              name: '',
              token: ''
            })}
          />
        </ButtonWrapper>
      </Wrapper>
    </form>
  );
}

export default Auth;
