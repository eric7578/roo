import React, { useState, createContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import useStorage from '../hooks/useStorage';

const Context = createContext();

const DataSource = ({ provider, owner, repo, children }) => {
  const [dataSource, setDataSource] = useState();
  const { tokens } = useStorage();

  useEffect(() => {
    const initialize = async () => {
      const { default: DataSource } = await import(`../dataSource/${provider}`);
      const selected = tokens.find(token => token.selected);
      const token = selected ? selected.value : null;
      setDataSource(new DataSource({ owner, repo, token }));
    };
    initialize();
  }, [provider, owner, repo, tokens]);

  return (
    <Context.Provider value={dataSource}>
      {dataSource && children}
    </Context.Provider>
  );
};

DataSource.propTypes = {
  provider: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired,
  children: PropTypes.node
};

export default DataSource;
