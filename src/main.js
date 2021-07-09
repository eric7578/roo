import { enableMapSet } from 'immer';
enableMapSet();

import React from 'react';
import ReactDOM from 'react-dom';
import Roo from './components/Roo';

const app = document.createElement('div');
document.body.appendChild(app);
ReactDOM.render(<Roo />, app);
