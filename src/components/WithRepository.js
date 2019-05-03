import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useLocationEffect from './hooks/useLocationEffect';

export const Repository = createContext(null);

const WithRepository = props => {
  const [repo, setRepo] = useState(null);
  const [params, setParams] = useState(null);

  useLocationEffect(() => {
    setParams(props.syncParams());
  });

  useEffect(() => {
    props.getRepo().then(setRepo);
  }, []);

  if (!repo || !params) {
    return null;
  }

  const ctx = {
    ...repo,
    ...params
  };

  if (!params.pr && !params.commit) {
    ctx.head = params.head || repo.defaultBranch;
  }

  return <Repository.Provider {...props} value={ctx} />;
}

WithRepository.propTypes = {
  syncParams: PropTypes.func.isRequired,
  getRepo: PropTypes.func.isRequired
};

export default WithRepository;
