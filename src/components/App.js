import React, { useState, useCallback } from 'react';
import DataSource from './DataSource';
import Storage from './Storage';
import Explorer from './Explorer/Explorer';
import Credentials from './Credentials';
import Search from './Search';
import Source from './Source';
import * as TabTypes from '../types/TabTypes';

import 'file-icons-js/css/style.css';

const App = props => {
  const [tab, setTab] = useState(TabTypes.SEARCH);

  const onImportFailed = useCallback(err => {
    setTab(TabTypes.CREDENTIALS);
  }, []);

  return (
    <Storage>
      <DataSource onPathChanged={setTab} onImportFailed={onImportFailed}>
        <Explorer tab={tab} onChangeTab={setTab}>
          {tab === TabTypes.CREDENTIALS && <Credentials />}
          {tab === TabTypes.SEARCH && <Search />}
          {tab === TabTypes.SOURCE && <Source />}
        </Explorer>
      </DataSource>
    </Storage>
  );
};

export default App;
