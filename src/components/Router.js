import React, { useState, createContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { pathToRegexp } from 'path-to-regexp';

export const RouterContext = createContext();

const getWindowURL = () => {
  return window.location.pathname;
};

const Router = ({ patterns, getURL, children }) => {
  const [currentURL, setCurrentURL] = useState(() => getURL());
  const [routing, setRouting] = useState();

  useEffect(() => {
    const onMessage = message => {
      if (message.type === 'roo/locationChanged') {
        setCurrentURL(getURL());
      }
    };
    chrome.runtime.onMessage.addListener(onMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(onMessage);
    };
  }, [getURL]);

  useEffect(() => {
    for (const [match, pattern] of Object.entries(patterns)) {
      const keys = [];
      const regexp = pathToRegexp(pattern, keys);
      const matched = regexp.exec(currentURL);

      if (matched) {
        const params = keys.reduce((params, key, idx) => {
          params[key.name] = matched[idx + 1];
          return params;
        }, {});
        return setRouting({
          match: {
            [match]: true
          },
          params
        });
      }
    }
    return setRouting({
      match: false
    });
  }, [patterns, currentURL]);

  return (
    <RouterContext.Provider value={routing}>
      {routing && children}
    </RouterContext.Provider>
  );
};

Router.propTypes = {
  patterns: PropTypes.objectOf(PropTypes.string).isRequired,
  getURL: PropTypes.func.isRequired,
  children: PropTypes.element
};

Router.defaultProps = {
  getURL: getWindowURL
};

export default Router;
