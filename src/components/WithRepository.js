import React, { createContext, memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import getRenderer from './renderer/getRenderer';

export const Repository = createContext(null);

const WithRepository = props => {
  const [params, setParams] = useState(() => props.syncParams());
  const [renderer, setRenderer] = useState(() => getRenderer());

  // initialize with default branch
  useEffect(() => {
    if (!params.sha) {
      props.getBranches().then(branches => {
        setParams({
          ...params,
          sha: branches[0].name
        });
      });
    }
  }, []);

  useEffect(() => setRenderer(getRenderer(params)), [params]);

  return renderer && (
    <Repository.Provider
      {...props}
      value={{
        params,
        renderer
      }}
    />
  );
}

WithRepository.propTypes = {
  syncParams: PropTypes.func.isRequired,
  getBranches: PropTypes.func.isRequired
};

export default memo(WithRepository);
