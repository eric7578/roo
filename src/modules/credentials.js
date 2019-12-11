const ADD_CREDENTIAL = 'credential/ADD_CREDENTIAL';
const REMOVE_CREDENTIAL = 'credential/REMOVE_CREDENTIAL';
const MODIFY_CREDENTIAL = 'credential/MODIFY_CREDENTIAL';

export function addCredential(hostname) {
  return {
    type: ADD_CREDENTIAL,
    hostname
  };
}

export function removeCredential(hostname, index) {
  return {
    type: REMOVE_CREDENTIAL,
    hostname,
    index
  };
}

export function modifyCredential(hostname, ...args) {
  if (args.length === 3) {
    const [field, index, value] = args;
    return {
      type: MODIFY_CREDENTIAL,
      hostname,
      field,
      index,
      value
    };
  } else if (args.length === 2) {
    const [field, value] = args;
    return {
      type: MODIFY_CREDENTIAL,
      hostname,
      field,
      value
    };
  }
}

export function saveCredential() {
  return async (dispatch, getState, { idb }) => {
    const state = getState();
    await idb.saveCredentials(state.credentials);
  };
}

export default function reducer(state = {}, action) {
  switch (action.type) {
    case ADD_CREDENTIAL: {
      const applyCredential = state[action.hostname];
      const tokens = applyCredential ? applyCredential.tokens : [];
      const dataSource = applyCredential
        ? applyCredential.dataSource
        : action.hostname;
      return {
        ...state,
        [action.hostname]: {
          ...applyCredential,
          dataSource,
          tokens: [
            ...tokens,
            {
              value: '',
              selected: false
            }
          ]
        }
      };
    }

    case REMOVE_CREDENTIAL: {
      const { tokens } = state[action.hostname];
      return {
        ...state,
        [action.hostname]: {
          ...state[action.hostname],
          tokens: [
            ...tokens.slice(0, action.index),
            ...tokens.slice(action.index + 1)
          ]
        }
      };
    }

    case MODIFY_CREDENTIAL: {
      let applyCredential = state[action.hostname];
      if (action.hasOwnProperty('index')) {
        const { tokens } = applyCredential;
        return {
          ...state,
          [action.hostname]: {
            ...applyCredential,
            tokens: [
              ...tokens.slice(0, action.index),
              {
                ...tokens[action.index],
                [action.field]: action.value
              },
              ...tokens.slice(action.index + 1)
            ]
          }
        };
      } else {
        return {
          ...state,
          [action.hostname]: {
            ...applyCredential,
            [action.field]: action.value
          }
        };
      }
    }

    default:
      return state;
  }
}
