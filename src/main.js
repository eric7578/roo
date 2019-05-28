import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const app = document.createElement('div');
app.id = 'roo-app';
document.body.appendChild(app);
ReactDOM.render(<App />, app);
