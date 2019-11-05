import React, { useState, createContext } from 'react';
import useEffectOnce from '../hooks/useEffectOnce';
import * as db from '../storage/db';

export const Context = createContext();

const Storage = props => {
  const [storage, setStorage] = useState({
    sync: false
  });

  useEffectOnce(async () => {
    await db.initialize();
    const preferences = await db.retrievePreferences();
    const credentials = await db.retrievCredentials();
    setStorage({
      sync: true,
      credentials,
      preferences
    });
  });

  return (
    <Context.Provider
      value={{
        credentials: storage.credentials,
        preferences: storage.preferences,
        async syncCredentials(credentials) {
          await db.saveCredentials(credentials);
          setStorage({
            ...storage,
            credentials,
            sync: true
          });
        }
      }}
    >
      {storage.sync && props.children}
    </Context.Provider>
  );
};

export default Storage;
