import React, { createContext, useState, useEffect, useContext } from 'react';
import { pathToRegexp } from 'path-to-regexp';
import produce from 'immer';
import { Context as StorageContext } from './Storage';
import { BrowsingModes } from '../enum';

export const Context = createContext();

export default function Backend({ children }) {
  const { tokens } = useContext(StorageContext);
  const [backend, setBackend] = useState({
    ready: false,
    params: null
  });

  useEffect(() => {
    for (const backend of process.env.BACKENDS) {
      const pkg = require(`../backends/${backend}`);
      if (pkg.applyModule()) {
        let token = '';
        if (tokens.length) {
          const selected = tokens.find(t => t.selected);
          token = selected?.value ?? '';
        }
        pkg.loadModule(token).then(({ browser, ...rest }) => {
          setBackend({
            ...rest,
            ...matchBrowser(browser),
            browser,
            ready: true
          });
        });
        return;
      }
    }
  }, [tokens]);

  useEffect(() => {
    if (backend) {
      const onMessage = message => {
        if (message.type === 'roo/locationChanged') {
          setBackend(
            produce(backend => {
              const { browsingMode, params } = matchBrowser(backend.browser);
              backend.browsingMode = browsingMode;
              backend.params = params;
            })
          );
        }
      };

      chrome.runtime.onMessage.addListener(onMessage);
      return () => chrome.runtime.onMessage.removeListener(onMessage);
    }
  }, [backend]);

  return (
    <Context.Provider value={backend}>
      {backend.ready && children}
    </Context.Provider>
  );
}

function matchBrowser(browser) {
  for (const [browsingMode, ...patterns] of browser) {
    for (const pattern of patterns) {
      const keys = [];
      const regexp = pathToRegexp(pattern, keys);
      const matched = regexp.exec(window.location.pathname);

      if (matched) {
        const params = keys.reduce((params, key, idx) => {
          params[key.name] = matched[idx + 1];
          return params;
        }, {});

        return {
          browsingMode,
          params
        };
      }
    }
  }

  return {
    browsingMode: null,
    params: {}
  };
}
