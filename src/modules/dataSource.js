const ADD_CRED = 'dataSource/ADD_CRED';
const REMOVE_CRED = 'dataSource/REMOVE_CRED';
const MODIFY_CRED = 'dataSource/MODIFY_CRED';
const RETRIEVE_CRED = 'dataSource/RETRIEVE_CRED';
const SET_DEFAULT_CRED = 'dataSource/SET_DEFAULT_CRED';

export function addCredential(hostname = window.location.hostname) {
  return {
    type: ADD_CRED,
    hostname
  };
}

export function removeCredential(index, hostname = window.location.hostname) {
  return {
    type: REMOVE_CRED,
    hostname,
    index
  };
}

export function setDefaultCredential(
  value,
  index,
  hostname = window.location.hostname
) {
  return {
    type: SET_DEFAULT_CRED,
    index,
    value,
    hostname
  };
}

export function modifyCredential(
  field,
  value,
  index,
  hostname = window.location.hostname
) {
  if (arguments.length === 2) {
    hostname = index ?? window.location.hostname;
    index = null;
  }
  return {
    type: MODIFY_CRED,
    index,
    field,
    value,
    hostname
  };
}

export function saveCredential(hostname = window.location.hostname) {
  return async (dispatch, getState, { idb }) => {
    const state = getState();
    const credentials = Array.from(
      state.dataSource.credentials.entries()
    ).reduce((creds, [hostname, config]) => {
      creds[hostname] = config;
      return creds;
    }, {});
    await idb.saveCredentials(credentials);
    await dispatch(retrieveCredentials(hostname));
  };
}

export function retrieveCredentials(hostname = window.location.hostname) {
  return async (dispatch, getState, { idb }) => {
    const credentials = await idb.retrievCredentials();
    dispatch({
      type: RETRIEVE_CRED,
      hostname,
      credentials
    });
  };
}

export default function reducer(state = {}, action) {
  switch (action.type) {
    case RETRIEVE_CRED:
      return onRetrieveCredentials(state, action);

    case ADD_CRED:
      return onAddCredential(state, action);

    case REMOVE_CRED:
      return onRemoveCredential(state, action);

    case MODIFY_CRED:
      return onModifyCredential(state, action);

    case SET_DEFAULT_CRED:
      return onSetDefaultCredential(state, action);

    default:
      return state;
  }
}

function onRetrieveCredentials(state, action) {
  const credentials = Object.entries(action.credentials).reduce(
    (credentials, [hostname, config]) => credentials.set(hostname, config),
    new Map()
  );

  const activeConfig = {};
  const config = credentials.get(action.hostname);
  if (config) {
    activeConfig.token = config.tokens.find(t => t.selected)?.value;
    activeConfig.dataSource = config.dataSource;
  }

  return {
    credentials,
    activeConfig
  };
}

function onAddCredential(state, action) {
  const credentials = new Map(state.credentials);
  const config = credentials.get(action.hostname);
  credentials.set(action.hostname, {
    dataSource: config.dataSource ?? action.hostname,
    tokens: [
      ...config.tokens,
      {
        value: '',
        selected: false
      }
    ]
  });

  return {
    ...state,
    credentials
  };
}

function onRemoveCredential(state, action) {
  const credentials = new Map(state.credentials);
  const config = credentials.get(action.hostname);
  credentials.set(action.hostname, {
    ...config,
    tokens: [
      ...config.tokens.slice(0, action.index),
      ...config.tokens.slice(action.index + 1)
    ]
  });

  return {
    ...state,
    credentials
  };
}

function onModifyCredential(state, action) {
  const credentials = new Map(state.credentials);
  const config = credentials.get(action.hostname);
  if (action.index === null) {
    credentials.set(action.hostname, {
      ...config,
      [action.field]: action.value
    });
  } else {
    credentials.set(action.hostname, {
      ...config,
      tokens: [
        ...config.tokens.slice(0, action.index),
        {
          ...config.tokens[action.index],
          [action.field]: action.value
        },
        ...config.tokens.slice(action.index + 1)
      ]
    });
  }

  return {
    ...state,
    credentials
  };
}

function onSetDefaultCredential(state, action) {
  const credentials = new Map(state.credentials);
  const config = credentials.get(action.hostname);
  credentials.set(action.hostname, {
    ...config,
    tokens: config.tokens.map((token, i) => {
      token.selected = action.value && action.index === i;
      return token;
    })
  });

  return {
    ...state,
    credentials
  };
}
