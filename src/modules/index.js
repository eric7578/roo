import { combineReducers } from 'redux';
import vars from './vars';
import dataSource from './dataSource';
import preferences from './preferences';
import tree from './tree';

export default combineReducers({
  vars,
  dataSource,
  preferences,
  tree
});
