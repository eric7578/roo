import {useReducer, useMemo, useCallback} from 'react';

const SET_DEFAULT = 'useAuth/SET_DEFAULT';
const REMOVE = 'useAuth/REMOVE';
const MODIFY = 'useAuth/MODIFY';

export default function useAuth(provider) {
  const [state, dispatch] = useReducer(reducer, provider, decompress);
  const actions = useMemo(() => {
    return {
      select(index) {
        dispatch({
          type: SET_DEFAULT,
          index
        });
      },
      remove(index) {
        dispatch({
          type: REMOVE,
          index
        });
      },
      modify(index, auth = {name: '', token: ''}) {
        dispatch({
          ...auth,
          index,
          type: MODIFY
        });
      }
    };
  }, []);
  const save = useCallback(() => {
    compress(provider, state)
  }, [provider, state]);

  return {
    ...actions,
    save,
    value: state.value,
    selected: state.selected
  };
}

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
    selected: action.index
  };
}

function remove(state, action) {
  return {
    ...state,
    selected: action.index === state.selected
      ? -1
      : state.selected,
    value: [
      ...state.value.slice(0, action.index),
      ...state.value.slice(action.index)
    ]
  };
}

function modify(state, action) {
  const {index, type, ...auth} = action;
  const nextAuth = [...state.value];
  nextAuth[index] = auth;
  return {
    ...state,
    selected: action.selected
      ? auth.length
      : state.selected,
    value: nextAuth
  };
}

function decompress(provider) {
  const compressed = localStorage.getItem(`${provider}_auth`);
  const value = [];
  let selected = -1;

  if (compressed) {
    for (const [index, {n, t, d}] in Object.entries(compressed)) {
      if (d === 1) {
        selected = index;
      }
      value.push({
        name: n,
        token: t
      });
    }
  }

  return {value, selected};
}

function compress(provider, state) {
  const compressed = state.value.map(({name, token}, index) => {
    const compressed = {
      n: name,
      t: token
    };
    if (state.selected === index) {
      compressed.d = 1;
    }
    return compressed;
  });

  localStorage.setItem(`${provider}_auth`, JSON.stringify(compressed));
}
