import React from 'react';
import ReactDOM from 'react-dom';
import document from 'global/document'
import App from './App';

const app = document.createElement('div');
document.body.appendChild(app);
ReactDOM.render(<App />, app);
