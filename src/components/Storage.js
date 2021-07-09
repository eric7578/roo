import React, {
  useState,
  createContext,
  useEffect,
  useCallback,
  useRef
} from 'react';
import produce from 'immer';
import { open } from '../idb';
import useUpdateEffect from '../hooks/useUpdateEffect';

export const Context = createContext();

const PREFERENCES = `${window.location.host}_preferences`;
const TOKENS = `${window.location.host}_tokens`;

const Storage = ({ dbname, children }) => {
  const refDb = useRef();
  const [storage, setStorage] = useState({
    sync: false,
    preferences: {},
    tokens: []
  });

  const setPreferences = useCallback((key, value) => {
    setStorage(
      produce(storage => {
        storage.preferences[key] = value;
      })
    );
  }, []);

  const setTokens = useCallback(tokens => {
    setStorage(
      produce(storage => {
        storage.tokens = tokens;
      })
    );
  }, []);

  useEffect(() => {
    (async function () {
      const db = await open(dbname, [PREFERENCES, TOKENS]);
      refDb.current = db;

      const [preferences, tokens] = await Promise.all([
        db.getObject(PREFERENCES),
        db.getObject(TOKENS)
      ]);
      setStorage({
        sync: true,
        preferences,
        tokens: Object.values(tokens)
      });
    })();

    return () => {
      refDb.current?.close();
    };
  }, [dbname]);

  useUpdateEffect(() => {
    if (storage.sync) {
      refDb.current.putObject(PREFERENCES, storage.preferences);
    }
  }, [storage.sync, storage.preferences]);

  useUpdateEffect(() => {
    if (storage.sync) {
      refDb.current.putObject(TOKENS, storage.tokens);
    }
  }, [storage.sync, storage.tokens]);

  return (
    <Context.Provider
      value={{
        ...storage,
        setPreferences,
        setTokens
      }}
    >
      {storage.sync && children}
    </Context.Provider>
  );
};

Storage.defaultProps = {
  dbname: 'roo'
};

export default Storage;
