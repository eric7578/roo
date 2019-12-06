const PARAMS = 'vars/PARAMS';

export function params(data) {
  return {
    type: PARAMS,
    data
  };
}

export default function(state = {}, action) {
  switch (action.type) {
    case PARAMS:
      return {
        ...state,
        params: action.data
      };
    default:
      return state;
  }
}
