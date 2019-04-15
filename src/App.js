import React, { useRef, useState } from 'react';
import WithRepository, { Repository } from './components/WithRepository';
import Tree from './components/Tree';
import Explorer from './components/Explorer';
import getDataSource from './dataSource/getDataSource';
import './icon';
import Auth from './components/Auth';
import Search from './components/Search';
import Toggleable from './components/Toggleable';

const App = props => {
  const ds = useRef(getDataSource());

  const [panel, setPanel] = useState('tree');

  const toggleTo = target => setPanel(panel === target ? 'tree' : target);
  const onToggleSearch = e => toggleTo('search');
  const onToggleAuth = e => toggleTo('auth');

  return (
    <WithRepository
      syncParams={() => ds.current.params}
      getBranches={ds.current.getBranches}
    >
      <Repository.Consumer>
        {({ params }) =>
          <Explorer>
            <button onClick={onToggleSearch}>Search</button>
            <button onClick={onToggleAuth}>Auth</button>
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
              {params.pr && <div>todo</div>}
              {!params.pr && params.sha &&
                <Tree
                  sha={params.sha}
                  getNodes={ds.current.getNodes}
                />
              }
            </Toggleable>
          </Explorer>
        }
      </Repository.Consumer>
    </WithRepository>
  );
}

export default App;
