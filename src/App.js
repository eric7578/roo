import React, {useState} from 'react';
import styled from 'styled-components';
import Head from './components/Head';
import Commit from './components/Commit';
import Explorer from './components/Explorer';
import Auth from './components/Auth';
import Search from './components/Search';
import PullRequest from './components/PullRequest';
import Toggleable from './components/Toggleable';
import ActitivyBar from './components/ActivityBar';
import {DataSource} from './context';
import WithStorage from './components/WithStorage';
import WithDataSource from './components/WithDataSource';

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

  return (
    <WithStorage>
      <WithDataSource>
        <Explorer>
          <ActitivyBar selected={tab} onChange={onChangeTab} />
          <Tab isOpen={tab === 'auth'}>
            <Auth />
          </Tab>
          <Tab isOpen={tab === 'search'}>
            <Search />
          </Tab>
          <DataSource.Consumer>
            {({pr, commit, head, defaultBranch}) =>
              <Tab isOpen={tab === 'tree'}>
                {pr && <PullRequest pr={pr} />}
                {commit && <Commit commit={commit} />}
                {!pr && !commit && <Head head={head || defaultBranch} />}
              </Tab>
            }
          </DataSource.Consumer>
        </Explorer>
      </WithDataSource>
    </WithStorage>
  );
}

export default App;
