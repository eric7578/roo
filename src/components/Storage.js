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
        async sync(credentials, preferences) {
          setStorage({ sync: false });
          await db.saveCredentials(credentials);
          await db.savePreferences(preferences);
          setStorage({
            sync: true,
            credentials,
            preferences
          });
        }
      }}
    >
      {storage.sync && props.children}
    </Context.Provider>
  );
};

export default Storage;
