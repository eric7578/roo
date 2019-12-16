import { combineReducers } from 'redux';
import vars from './vars';
import credentials from './credentials';
import preferences from './preferences';
import tree from './tree';

export default combineReducers({
  vars,
  credentials,
  preferences,
  tree
});
