import React, { useEffect, useContext, useRef, useState } from 'react';
import { RouterContext } from './Router';
import Explorer from './Explorer';
import Idb from '../idb';

export const AppContext = React.createContext();

const App = ({ backendClass }) => {
  const { params } = useContext(RouterContext);
  const refIdb = useRef(new Idb('roo'));
  const [credential, setCredential] = useState();
  const [preferences, setPreferences] = useState();
  const [backend, setBackend] = useState();

  useEffect(() => {
    const initialize = async () => {
      await refIdb.current.initialize();

      const credential = await refIdb.current.getCredential();
      const preferences = await refIdb.current.getPreferences();
      setCredential(credential);
      setPreferences(preferences);
    };
    initialize();
  }, []);

  useEffect(() => {
    const backend = new backendClass(params.owner, params.repo, credential);
    setBackend(backend);
  }, [params.owner, params.repo, credential]);

  return (
    <AppContext.Provider
      value={{
        backend,
        credential,
        preferences,
        async setCredential(credential) {
          await refIdb.current.saveCredential(credential);
          setCredential(credential);
        },
        async setPreferences(preferences) {
          await refIdb.current.savePreferences(preferences);
          setPreferences(preferences);
        }
      }}
    >
      {preferences && backend && <Explorer />}
    </AppContext.Provider>
  );
};

export default App;
