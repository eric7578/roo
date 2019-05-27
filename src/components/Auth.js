import React, {useReducer, useContext} from 'react';
import {Storage} from '../context';

const SET_DEFAULT = 'useAuth/SET_DEFAULT';
const REMOVE = 'useAuth/REMOVE';
const MODIFY = 'useAuth/MODIFY';

function reducer(state, action) {
  switch (action.type) {
    case SET_DEFAULT:
      return setDefault(state, action);
    case REMOVE:
      return remove(state, action);
    case MODIFY:
      return modify(state, action);
    default:
      return state;
  }
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
    selected: action.index === action.selected ? -1 : action.selected,
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
    selected: action.selected
      ? auth.length
      : action.selected,
    value: nextAuth
  };
}

const Auth = props => {
  const {token, setToken} = useContext(Storage);
  const [{value, selected}, dispatch] = useReducer(reducer, token, token => {
    const state = {
      value: [],
      selected: -1
    };

    token.forEach(({name, token, selected}, index) => {
      if (selected) {
        state.selected = index;
      }
      state.value.push({name, token});
    });

    return state;
  });

  const onChangeToken = () => {
    const token = value.map(({name, token}, index) => {
      const t = {name, token};
      if (selected === index) {
        t.selected = true;
      }
      return t;
    });
    setToken(token);
  }

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onChangeToken();
      }}
    >
      <ul>
        {value.map(({name, token}, index) =>
          <li key={index}>
            <input
              type='checkbox'
              checked={index === selected}
              onChange={e => dispatch({
                type: SET_DEFAULT,
                index,
                selected: e.target.checked
              })}
            />
            <input
              type='text'
              value={name}
              onChange={e => dispatch({
                type: MODIFY,
                index,
                name: e.target.value
              })}
            />
            <input
              type='text'
              value={token}
              onChange={e => dispatch({
                type: MODIFY,
                index,
                token: e.target.value
              })}
            />
            <input
              type='button'
              value='del'
              onClick={e => dispatch({
                type: REMOVE,
                index
              })}
            />
          </li>
        )}
      </ul>
      <input
        type='submit'
        value='save'
      />
      <input
        type='button'
        value='Add account'
        onClick={e => dispatch({
          type: MODIFY,
          index: value.length
        })}
      />
    </form>
  );
}

export default Auth;
