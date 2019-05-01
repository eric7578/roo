import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useLocation from './hooks/useLocation';

export const Repository = createContext(null);

const WithRepository = props => {
  const [params, setParams] = useState(() => props.syncParams());
  useLocation(() => {
    const nextParams = props.syncParams();
    setParams(nextParams);
  });

  // initialize with default branch
  useEffect(() => {
    if (!params.sha) {
      props.getRepo().then(repo => {
        setParams({
          ...params,
          sha: repo.defaultBranch
        });
      });
    }
  }, [params.sha]);

  return params.sha ? (
    <Repository.Provider
      {...props}
      value={params}
    />
  ) : null;
}

WithRepository.propTypes = {
  syncParams: PropTypes.func.isRequired,
  getRepo: PropTypes.func.isRequired
};

export default WithRepository;
