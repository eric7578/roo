import React, { useState, createContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as vars from '../modules/vars';
import { dataSourceTypes } from '../enum';

const Context = createContext();

const DataSource = props => {
  const dispatch = useDispatch();
  const activeToken = useSelector(state => state.credentials.activeToken);
  const activeToken = useSelector(state => state.credentials.active);
  const params = useSelector(state => state.vars.params);
  const dataSource = useMemo(() => {
    if (!dataSourceTypes.includes(dataSource)) {
      const err = new Error(`Cannot find matching data source: ${dataSource}`);
      throw err;
    }
    return require(`./${dataSource}`).default(token);
  }, [activeToken, params]);

  useEffect(() => {
    const onMessage = message => {
      if (message.type === 'roo/locationChanged') {
        const params = paramsParser(window.location.pathname);
        dispatch(vars.updateParams(params));
      }
    };
    chrome.runtime.onMessage.addListener(onMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(onMessage);
    };
  }, [dispatch]);

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
