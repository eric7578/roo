const UPDATE = 'preferences/UPDATE';

export function setPreference(field, value) {
  return (dispatch, getState, { idb }) => {
    const state = getState();
    if (state.preferences[field] !== value) {
      dispatch({
        type: UPDATE,
        field,
        value
      });
      idb.savePreferences(field, value);
    }
  };
}

export default function reducer(state = {}, action) {
  switch (action.type) {
    case UPDATE:
      return {
        ...state,
        [action.field]: action.value
      };
    default:
      return state;
  }
}
