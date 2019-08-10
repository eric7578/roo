import React, {useState, useContext} from 'react';
import styled from 'styled-components';
import Head from './Head';
import Commit from './Commit';
import Explorer from './Explorer';
import Auth from './Auth';
import Search from './Search';
import PullRequest from './PullRequest';
import Toggleable from './Toggleable';
import ActitivyBar from './ActivityBar';
import {DataSource} from '../context';
import WithStorage from './WithStorage';
import WithDataSource from './WithDataSource';

const Tab = styled(Toggleable)`
  overflow: auto;
  width: 100%;
`;

const App = props => {
  const [tab, setTab] = useState('tree');
  const onChangeTab = nextTab => {
    setTab(tab === nextTab ? 'tree' : nextTab);
  }

  return (
    <WithStorage>
      <Explorer>
        <ActitivyBar selected={tab} onChange={onChangeTab} />
        <Tab isOpen={tab === 'auth'}>
          <Auth />
        </Tab>
        <WithDataSource>
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
        </WithDataSource>
      </Explorer>
    </WithStorage>
  );
}

export default App;
