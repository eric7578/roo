import React, {useState} from 'react';
import WithRepository, {Repository} from './components/WithRepository';
import Head from './components/Head';
import Commit from './components/Commit';
import Explorer from './components/Explorer';
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
      <WithRepository>
        <WithRenderer>
          <Repository.Consumer>
            {({params, repo}) =>
              <>
                <Toggleable isOpen={panel === 'auth'}>
                  <Auth />
                </Toggleable>
                <Toggleable isOpen={panel === 'search'}>
                  <Search />
                </Toggleable>
                <Toggleable isOpen={panel === 'tree'}>
                  {params.pr && <PullRequest pr={params.pr} />}
                  {params.commit && <Commit commit={params.commit} />}
                  {!params.pr && !params.commit && <Head head={params.head || repo.defaultBranch} />}
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
