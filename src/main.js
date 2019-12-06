import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducer from './modules';
import * as idb from './api/idb';
import { selectDataSource } from './api/dataSource';

async function init() {
  await idb.initialize();
  const credentials = await idb.retrievCredentials();
  const preferences = await idb.retrievePreferences();

  let dataSource = await selectDataSource(credentials);

  const idbApi = {
    ...idb,
    async saveCredentials(credentials) {
      await idb.saveCredentials(credentials);
      dataSource = await selectDataSource(credentials);
    }
  };

  const store = createStore(
    reducer,
    {
      preferences,
      credentials
    },
    applyMiddleware(
      createLogger({
        timestamp: false,
        collapsed: true,
        diff: true
      }),
      thunk.withExtraArgument({
        idb: idbApi,
        dataSource
      })
    )
  );

  const app = document.createElement('div');
  app.id = 'roo-app';
  document.body.appendChild(app);
  ReactDOM.render(<Provider store={store}></Provider>, app);
}

init().catch(console.error);
