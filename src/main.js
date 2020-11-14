import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Router from './components/Router';
import getBackend from './backends';

(async () => {
  const { default: backendClass, patterns } = await getBackend();

  const app = document.createElement('div');
  app.id = 'roo-app';
  document.body.appendChild(app);
  ReactDOM.render(
    <Router patterns={patterns}>
      <App backendClass={backendClass} />
    </Router>,
    app
  );
})().catch(console.error);
