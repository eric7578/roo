import React, { useState, useContext } from 'react';
import styled from 'styled-components';
// import Head from './Head';
// import Commit from './Commit';
import Explorer from './Explorer';
import Auth from './Auth';
// import Search from './Search';
// import PullRequest from './PullRequest';
import Toggleable from './Toggleable';
import DataSource from './DataSource';
import PathMatch, { Match } from './PathMatch';
import Storage from './Storage';

const Tab = styled(Toggleable)`
  overflow: auto;
  width: 100%;
`;

const App = props => {
  const [tab, setTab] = useState('tree');
  const onChangeTab = nextTab => {
    setTab(tab === nextTab ? 'tree' : nextTab);
  };

  return (
    <Storage>
      <PathMatch>
        <Match pattern="https://:provider/:owner/:repo">
          {({ provider, owner, repo }) => (
            <DataSource provider={provider} owner={owner} repo={repo}>
              <Explorer onChange={onChangeTab}>
                {tab === 'auth' && <Auth />}
                {/*
                    <Tab isOpen={tab === 'search'}>
                      <Search />
                    </Tab>
                    <DataSource.Consumer>
                      {({ dataSource }) => (
                        <Tab isOpen={tab === 'tree'}>
                          <Match pattern={dataSource.prURLPattern}>pr</Match>
                          <Match pattern={dataSource.commitURLPattern}>
                            commit
                          </Match>
                          <Match pattern={dataSource.treeURLPattern}>tree</Match>
                          <Match pattern={dataSource.fallbackURLPattern}>
                            fallback
                          </Match>
                        </Tab>
                      )}
                    </DataSource.Consumer>
                    <DataSource.Consumer>
                      {({ pr, commit, head, defaultBranch }) => (
                        <Tab isOpen={tab === 'tree'}>
                          {pr && <PullRequest pr={pr} />}
                          {commit && <Commit commit={commit} />}
                          {!pr && !commit && <Head head={head || defaultBranch} />}
                        </Tab>
                      )}
                    </DataSource.Consumer>
                */}
              </Explorer>
            </DataSource>
          )}
        </Match>
      </PathMatch>
    </Storage>
  );
};

export default App;
