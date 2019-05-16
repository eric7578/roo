import React, {useReducer, useEffect} from 'react';
import PropTypes from 'prop-types';

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

function decompress(prefix) {
  const compressed = localStorage.getItem(`${prefix}_auth`);
  const value = [];
  let selected = -1;

  if (compressed) {
    const auth = JSON.parse(compressed);
    auth.forEach(({ n, t, d }, index) => {
      if (d === 1) {
        selected = index;
      }
      value.push({
        name: n,
        token: t
      });
    });
  }

  return {value, selected};
}

function compress(prefix, value, selected) {
  const compressed = value.map(({name, token}, index) => {
    const compressed = {
      n: name,
      t: token
    };
    if (selected === index) {
      compressed.d = 1;
    }
    return compressed;
  });

  localStorage.setItem(`${prefix}_auth`, JSON.stringify(compressed));
}

const Auth = props => {
  const [{value, selected}, dispatch] = useReducer(reducer, props.prefix, decompress);

  const onChangeToken = () => {
    props.onChangeToken(value[selected] && value[selected].token);
  }

  useEffect(onChangeToken, []);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        compress(props.prefix, value, selected);
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

Auth.propTypes = {
  prefix: PropTypes.string.isRequired,
  onChangeToken: PropTypes.func.isRequired
};

export default Auth;
