const UPDATE_PARAMS = 'vars/UPDATE_PARAMS';

export function updateParams(params) {
  return {
    type: UPDATE_PARAMS,
    params
  };
}

export default function reducer(state = {}, action) {
  switch (action.type) {
    case UPDATE_PARAMS:
      return {
        ...state,
        params: action.params
      };
    default:
      return state;
  }
}
