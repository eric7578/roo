import React, {createContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import useParams from './hooks/useParams';
import useAuth from './hooks/useAuth';
import * as githubDataSource from '../dataSource/github';

export const Repository = createContext(null);

const WithRepository = props => {
  const params = useParams([
    'https\\://github.com/:owner/:repo/pull/:pr(/*)',       // pr
    'https\\://github.com/:owner/:repo/commit/:commit(/*)', // commit
    'https\\://github.com/:owner/:repo/tree/:head(/*)',     // branches
    'https\\://github.com/:owner/:repo(/*)'                 // other pages, simply show explorer
  ]);
  const auth = useAuth('github.com');
  const [repo, setRepo] = useState(null);

  useEffect(() => {
    const token = auth.value && auth.value[auth.selected]
      ? auth.value[auth.selected].token
      : null;
    const dataSource = githubDataSource.create(params.owner, params.repo, token);
    dataSource.getRepo().then(repo => {
      setRepo({
        ...repo,
        ...dataSource
      });
    });
  }, [params.owner, params.repo, auth.selected]);

  return repo && (
    <Repository.Provider
      {...props}
      value={{
        repo,
        params,
        auth
      }}
    />
  );
}

export default WithRepository;
