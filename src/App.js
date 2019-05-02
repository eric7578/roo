import React, { useState } from 'react';
import WithRepository, { Repository } from './components/WithRepository';
import BranchTree from './components/BranchTree';
import Explorer from './components/Explorer';
import dataSource from './dataSource';
import Auth from './components/Auth';
import Search from './components/Search';
import PullRequest from './components/PullRequest';
import Toggleable from './components/Toggleable';
import WithRenderer from './components/WithRenderer';
import './icon';

const App = props => {
  const [panel, setPanel] = useState('tree');

  const toggleTo = target => setPanel(panel === target ? 'tree' : target);
  const onToggleSearch = e => toggleTo('search');
  const onToggleAuth = e => toggleTo('auth');

  return (
    <Explorer>
      <button onClick={onToggleSearch}>Search</button>
      <button onClick={onToggleAuth}>Auth</button>
      <WithRepository
        syncParams={dataSource.syncParams}
        getRepo={dataSource.getRepo}
      >
        <WithRenderer>
          <Repository.Consumer>
            {({ pr, sha }) =>
              <>
                <Toggleable isOpen={panel === 'auth'}>
                  <Auth
                    getAuth={dataSource.getAuth}
                    setAuth={auth => {
                      dataSource.setAuth(auth);
                      dataSource.syncAuth();
                    }}
                  />
                </Toggleable>
                <Toggleable isOpen={panel === 'search'}>
                  <Search onSearch={dataSource.searchPath} />
                </Toggleable>
                <Toggleable isOpen={panel === 'tree'}>
                  {pr &&
                    <PullRequest
                      onGetPR={() => dataSource.getPullRequest(pr)}
                    />
                  }
                  {!pr &&
                    <BranchTree
                      branch={sha}
                      onLoadTree={dataSource.getNodes}
                    />
                  }
                </Toggleable>
              </>
            }
          </Repository.Consumer>
        </WithRenderer>
      </WithRepository>
    </Explorer>
  );
}

export default App;
