import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export const Repository = createContext(null);

const WithRepository = props => {
  const [params, setParams] = useState(() => props.syncParams());

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
  }, []);

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
