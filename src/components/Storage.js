import React, { useState, createContext, useEffect } from 'react';
import * as db from '../db';

export const Context = createContext();

const Storage = props => {
  const [sync, setSync] = useState(false);
  const [preferences, setPreferences] = useState({});
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    (async function() {
      const preferences = await db.retrievePreferences();
      const tokens = await db.retrieveTokens();
      setPreferences(preferences);
      setTokens(tokens);
      setSync(true);
    })();
  }, []);

  return (
    <Context.Provider
      value={{
        tokens,
        async setTokens(nextTokens) {
          await db.saveTokens(nextTokens);
          updateTokens(nextTokens);
        },
        preferences,
        async setPreferences(key, value) {
          const nextPreferences = {
            ...preferences,
            [key]: value
          };
          await db.savePreferences(nextPreferences);
          setPreferences(nextPreferences);
        }
      }}
    >
      {sync && props.children}
    </Context.Provider>
  );
};

export default Storage;
