import React, { useState, createContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import usePathnameUpdate from '../hooks/usePathnameUpdate';
import useStorage from '../hooks/useStorage';
import DataSourceTypes from '../types/DataSourceTypes';

export const Context = createContext();

const DataSource = props => {
  const [dataSource, setDataSource] = useState();
  const [loadedError, setLoadedError] = useState();
  const { credentials } = useStorage();

  if (loadedError) {
    console.error(loadedError);
  }

  const [token, dsPath] = useMemo(() => {
    let token = '';
    let dsPath = window.location.hostname;
    const credential = credentials[window.location.hostname];
    if (credential) {
      dsPath = credential.dataSource;
      const selected = credential.settings.find(setting => setting.selected);
      if (selected) {
        token = selected.value;
      }
    }
    return [token, dsPath];
  }, [credentials]);

  useEffect(() => {
    if (!DataSourceTypes.includes(dsPath)) {
      const err = new Error(`Cannot find matching data source: ${dsPath}`);
      err.dataSource = dsPath;
      onImportFailed(err);
      return;
    }
    import(`../dataSource/${dsPath}`)
      .then(dataSourceModule => dataSourceModule.init({ token }))
      .then(setDataSource)
      .catch(setLoadedError);
  }, [token, dsPath]);

  usePathnameUpdate(() => {
    if (dataSource) {
      const tabType = dataSource.onPathChanged();
      onPathChanged(tabType);
    }
  });

  return (
    <Context.Provider value={dataSource}>
      {dataSource && props.children}
    </Context.Provider>
  );
};

DataSource.propTypes = {
  onPathChanged: PropTypes.func,
  onImportFailed: PropTypes.func
};

export default DataSource;
