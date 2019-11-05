import React, { useState, useCallback } from 'react';
import DataSource from './DataSource';
import Storage from './Storage';
import Explorer from './Explorer';
import Credentials from './Credentials';

const App = props => {
  const [tab, setTab] = useState('tree');
  const onChangeTab = useCallback(
    nextTab => {
      setTab(tab === nextTab ? 'tree' : nextTab);
    },
    [setTab]
  );

  return (
    <Storage>
      <DataSource>
        <Explorer>
          <Credentials />
        </Explorer>
      </DataSource>
    </Storage>
  );
};

export default App;
