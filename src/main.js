import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { pathToRegexp } from 'path-to-regexp';
import reducer from './modules';
import * as idb from './api/idb';
import { selectDataSource } from './api/dataSource';
import * as dataSource from './modules/dataSource';
import * as preferences from './modules/preferences';
import App from './components/App';

async function init() {
  await idb.initialize();

  // let dataSource = await credentials;
  // let paramsParser = createParamsParser(dataSource.urlPatterns);

  const idbApi = {
    ...idb,
    async saveCredentials(credentials) {
      await idb.saveCredentials(credentials);
      // dataSource = await selectDataSource(credentials);
      // paramsParser = createParamsParser(dataSource.urlPatterns);
    }
  };

  const store = createStore(
    reducer,
    applyMiddleware(
      thunk.withExtraArgument({
        idb: idbApi,
        dataSource
      }),
      createLogger({
        timestamp: false,
        collapsed: true,
        diff: true
      })
    )
  );

  await store.dispatch(dataSource.retrieveCredentials());
  await store.dispatch(preferences.retrievePreferences());

  const app = document.createElement('div');
  document.body.appendChild(app);
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    app
  );
}

function createParamsParser(patterns) {
  const patternMatchers = patterns.map(pattern => {
    const keys = [];
    const regExp = pathToRegexp(pattern, keys);
    return {
      keys,
      regExp
    };
  });

  return path => {
    for (const { keys, regExp } of patternMatchers) {
      const args = regExp.exec(path);
      if (args) {
        const routeParams = args.slice(1);
        const params = keys.reduce((params, key, index) => {
          params[key.name] = routeParams[index];
          return params;
        }, {});
        return params;
      }
    }
  };
}

init().catch(console.error);
