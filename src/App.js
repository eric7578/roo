import React, { useRef, useState } from 'react';
import WithRepository, { Repository } from './components/WithRepository';
import BranchTree from './components/BranchTree';
import Explorer from './components/Explorer';
import getDataSource from './dataSource/getDataSource';
import Auth from './components/Auth';
import Search from './components/Search';
import PullRequest from './components/PullRequest';
import Toggleable from './components/Toggleable';
import WithRenderer from './components/WithRenderer';
import './icon';

const App = props => {
  const ds = useRef(getDataSource());

  const [panel, setPanel] = useState('tree');

  const toggleTo = target => setPanel(panel === target ? 'tree' : target);
  const onToggleSearch = e => toggleTo('search');
  const onToggleAuth = e => toggleTo('auth');

  const onGetPR = pr => () => {
    return ds.current.getPullRequest(pr).then(files => {
      return files.map(file => {
        return {
          ...file,
          path: file.filename
        };
      });
    })
  }

  return (
    <Explorer>
      <button onClick={onToggleSearch}>Search</button>
      <button onClick={onToggleAuth}>Auth</button>
      <WithRepository
        syncParams={ds.current.syncParams}
        getRepo={ds.current.getRepo}
      >
        <WithRenderer>
          <Repository.Consumer>
            {({ pr, sha }) =>
              <>
                <Toggleable isOpen={panel === 'auth'}>
                  <Auth
                    getAuth={ds.current.getAuth}
                    setAuth={auth => {
                      ds.current.setAuth(auth);
                      ds.current.syncAuth();
                    }}
                  />
                </Toggleable>
                <Toggleable isOpen={panel === 'search'}>
                  <Search onSearch={ds.current.searchPath} />
                </Toggleable>
                <Toggleable isOpen={panel === 'tree'}>
                  {pr &&
                    <PullRequest
                      onGetPR={onGetPR(pr)}
                    />
                  }
                  {!pr && sha &&
                    <BranchTree
                      head={sha}
                      onLoadTree={ds.current.getNodes}
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
