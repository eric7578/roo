import React, { createContext, useState, useEffect, useContext } from 'react';
import { pathToRegexp } from 'path-to-regexp';
import produce from 'immer';
import { Context as StorageContext } from './Storage';

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
        pkg.loadModule(token).then(instance => {
          setBackend({
            ...instance,
            ready: true,
            params: matchPatterns(instance.patterns)
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
              backend.params = matchPatterns(backend.patterns);
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

function matchPatterns(patterns) {
  const params = {};
  for (const pattern of patterns) {
    const keys = [];
    const regexp = pathToRegexp(pattern, keys);
    const matched = regexp.exec(window.location.pathname);

    if (matched) {
      keys.forEach((key, idx) => {
        params[key.name] = matched[idx + 1];
      });
      break;
    }
  }
  return params;
}
