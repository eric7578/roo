import React, {useState} from 'react';
import url from 'url';
import styled from 'styled-components';
import Head from './components/Head';
import Commit from './components/Commit';
import Explorer from './components/Explorer';
import Auth from './components/Auth';
import Search from './components/Search';
import PullRequest from './components/PullRequest';
import Toggleable from './components/Toggleable';
import ActitivyBar from './components/ActivityBar';
import {Renderer, Repository} from './context';
import useParams from './components/hooks/useParams';
import * as GithubRenderer from './components/GithubRenderer';
import * as githubDataSource from './dataSource/github';

const Tab = styled(Toggleable)`
  overflow: auto;
  padding: 18px;
  width: 100%;
`;

const App = props => {
  const [tab, setTab] = useState('tree');
  const onChangeTab = nextTab => {
    setTab(tab === nextTab ? 'tree' : nextTab);
  }

  // Renderer Context
  const [renderer, setRenderer] = useState(() => {
    const { hostname } = url.parse(window.location.href);
    switch (hostname) {
      case 'github.com':
        return GithubRenderer;
      default:
        throw new Error(`Can't find a renderer to support ${hostname}`);
    }
  });

  // Repository Context
  const params = useParams([
    'https\\://github.com/:owner/:repo/pull/:pr(/*)',       // pr
    'https\\://github.com/:owner/:repo/commit/:commit(/*)', // commit
    'https\\://github.com/:owner/:repo/tree/:head(/*)',     // tree
    'https\\://github.com/:owner/:repo/blob/:head(/*)',     // blob
    'https\\://github.com/:owner/:repo(/*)'                 // other pages, simply show explorer
  ]);
  const [repository, setRepository] = useState();

  return (
    <Renderer.Provider value={renderer}>
      <Repository.Provider value={{repo: repository, params}}>
        <Explorer>
          <ActitivyBar tab={tab} onChange={onChangeTab} />
          <Tab initialMount isOpen={tab === 'auth'}>
            <Auth
              prefix='github.com'
              onChangeToken={token => {
                const dataSource = githubDataSource.create(params.owner, params.repo, token);
                dataSource.getRepo().then(repo => setRepository({...repo, ...dataSource}));
              }}
            />
          </Tab>
          <Tab isOpen={tab === 'search'}>
            <Search />
          </Tab>
          {repository &&
            <Tab isOpen={tab === 'tree'}>
              {params.pr && <PullRequest pr={params.pr} />}
              {params.commit && <Commit commit={params.commit} />}
              {!params.pr && !params.commit && <Head head={params.head || repository.defaultBranch} />}
            </Tab>
          }
        </Explorer>
      </Repository.Provider>
    </Renderer.Provider>
  );
}

export default App;
