import { combineReducers } from 'redux';
import vars from './vars';
import credentials from './credentials';
import preferences from './preferences';

export default combineReducers({
  vars,
  credentials,
  preferences
});
