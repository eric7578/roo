import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useLocationEffect from './hooks/useLocationEffect';

export const Repository = createContext(null);

const WithRepository = props => {
  const [repo, setRepo] = useState(null);
  const [params, setParams] = useState(null);

  useEffect(() => {
    props.getRepo().then(setRepo);
  }, []);

  useLocationEffect(() => {
    setParams(props.syncParams());
  });

  return repo && params && (
    <Repository.Provider
      {...props}
      value={{
        ...repo,
        ...params,
        sha: params.sha || repo.defaultBranch
      }}
    />
  );
}

WithRepository.propTypes = {
  syncParams: PropTypes.func.isRequired,
  getRepo: PropTypes.func.isRequired
};

export default WithRepository;
