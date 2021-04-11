import { useState, useEffect } from 'react';
import { pathToRegexp } from 'path-to-regexp';
import backends from '../backends';

export default function useBackend(storage) {
  const [patterns, setPatterns] = useState([]);
  const [state, setState] = useState({
    params: null,
    backend: null,
    ready: false
  });

  useEffect(() => {
    const onMessage = message => {
      if (message.type === 'roo/locationChanged') {
        setState(state => ({
          ...state,
          params: matchPatterns(patterns)
        }));
      }
    };
    chrome.runtime.onMessage.addListener(onMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(onMessage);
    };
  }, [patterns]);

  useEffect(() => {
    if (storage.ready) {
      if (storage.backend) {
        const loadBackend = async Backend => {
          const { default: BackendClass } = import(`../backends/${Backend}`);
          const params = matchPatterns(BackendClass.patterns);
          setState({
            params,
            backend: new BackendClass(params),
            ready: true
          });
          setPatterns(BackendClass.patterns);
        };
        loadBackend(storage.backend);
      } else {
        const BackendClass = backends.find(b =>
          b.domains.includes(window.location.hostname)
        );
        const params = matchPatterns(BackendClass.patterns);
        setState({
          params,
          backend: new BackendClass(params),
          ready: true
        });
        setPatterns(BackendClass.patterns);
      }
    }
  }, [storage.ready]);

  return state;
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
