import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Explorer from './Explorer';
import Credentials from './Credentials';
import { SourceTree } from './Tree/index';
// import Search from './Search';
import { tabTypes } from '../enum';
import { setPreference } from '../modules/preferences';

import 'file-icons-js/css/style.css';

const App = props => {
  const [tab, setTab] = useState(tabTypes.TREE);
  const { toolBarOnly, explorerWidth } = useSelector(
    state => state.preferences
  );
  const dispatch = useDispatch();

  return (
    <Explorer
      toolBarOnly={toolBarOnly}
      tab={tab}
      onChangeTab={nextTab => {
        setTab(nextTab);
        if (toolBarOnly) {
          dispatch(setPreference('toolBarOnly', false));
        } else {
          dispatch(setPreference('toolBarOnly', nextTab === tab));
        }
      }}
      explorerWidth={explorerWidth}
      onChangeExplorerWidth={width =>
        dispatch(setPreference('explorerWidth', width))
      }
    >
      {tab === tabTypes.TREE && <SourceTree />}
      {tab === tabTypes.CREDENTIALS && <Credentials />}
      {/* {tab === TabTypes.SEARCH && <Search />} */}
    </Explorer>
  );
};

export default App;
