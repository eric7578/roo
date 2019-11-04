import React, { useState, createContext, useEffect } from 'react';
import useBrowserURL from '../hooks/useBrowserURL';
import useStorage from '../hooks/useStorage';

export const Context = createContext();

const DataSource = props => {
  const [dataSource, setDataSource] = useState();
  const [createFunction, setCreateFunction] = useState();
  const [token, setToken] = useState('');
  const [loadedError, setLoadedError] = useState();
  const { credentials } = useStorage();
  const browserURL = useBrowserURL();

  useEffect(() => {
    let assignedDataSource = browserURL.hostname;
    const credential = credentials[browserURL.origin];
    if (credential) {
      assignedDataSource = credential.dataSource;
      const selected = originTokens.settings.find(setting => setting.selected);
      if (selected) {
        setToken(selected.value);
      }
    }

    import(`../dataSource/${assignedDataSource}.js`)
      .then(({ default: createFunction }) => {
        setCreateFunction(createFunction);
        setDataSource(createFunction({ token }));
      })
      .catch(setLoadedError);
  }, [browserURL, credentials]);

  useEffect(() => {
    if (createFunction) {
      const instance = createFunction({ token });
      setDataSource(instance);
    }
  }, [browserURL]);

  return (
    <Context.Provider value={dataSource}>
      {dataSource && props.children}
    </Context.Provider>
  );
};

export default DataSource;
