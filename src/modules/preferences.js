const UPDATE = 'preferences/UPDATE';
const RETRIEVE_PREFERENCES = 'preferences/RETRIEVE_PREFERENCES';

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

export function retrievePreferences() {
  return async (dispatch, getState, { idb }) => {
    const preferences = await idb.retrievePreferences();
    dispatch({
      type: RETRIEVE_PREFERENCES,
      preferences
    });
  };
}

export default function reducer(
  state = {
    explorerWidth: 300,
    toolBarOnly: false
  },
  action
) {
  switch (action.type) {
    case RETRIEVE_PREFERENCES:
      return {
        ...state,
        ...action.preferences
      };
    case UPDATE:
      return {
        ...state,
        [action.field]: action.value
      };
    default:
      return state;
  }
}
