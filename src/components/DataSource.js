import React, { useState, createContext, useEffect, useMemo } from 'react';
import useBrowserURL from '../hooks/useBrowserURL';
import useStorage from '../hooks/useStorage';

export const Context = createContext();

const DataSource = props => {
  const [dataSource, setDataSource] = useState();
  const [createFunction, setCreateFunction] = useState();
  const [loadedError, setLoadedError] = useState();
  const { credentials } = useStorage();
  const browserURL = useBrowserURL();

  const token = useMemo(() => {
    let token = '';
    const credential = credentials[browserURL.hostname];
    if (credential) {
      const selected = credential.settings.find(setting => setting.selected);
      if (selected) {
        token = selected.value;
      }
    }
    return token;
  }, [browserURL, credentials]);

  console.log('browserURL', browserURL);
  console.log('token', token);

  useEffect(() => {
    let assignedDataSource = browserURL.hostname;
    import(`../dataSource/${assignedDataSource}.js`)
      .then(({ default: createFunction }) => {
        setCreateFunction(createFunction);
        setDataSource(createFunction({ token }));
      })
      .catch(setLoadedError);
  }, [browserURL, token]);

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
