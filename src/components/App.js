import React, { useState, useContext } from 'react';
import DataSource from './DataSource';
import Storage from './Storage';
import Explorer from './Explorer';

const App = props => {
  const [tab, setTab] = useState('tree');
  const onChangeTab = nextTab => {
    setTab(tab === nextTab ? 'tree' : nextTab);
  };

  return (
    <Storage>
      <DataSource>
        <Explorer />
      </DataSource>
    </Storage>
  );
};

export default App;
