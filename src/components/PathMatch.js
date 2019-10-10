import React, { useMemo, useState, useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import pathToRegexp from 'path-to-regexp';
import useEffectOnce from '../hooks/useEffectOnce';

const Context = createContext();

const getUrl = () => {
  const { href } = window.location;
  const hashIndex = href.lastIndexOf('#');
  return hashIndex < 0 ? href : href.slice(0, hashIndex);
};

const PathMatch = props => {
  const [url, setUrl] = useState(() => getUrl());

  useEffectOnce(() => {
    const onMessage = message => {
      if (message.type === 'roo/locationChanged') {
        setUrl(getUrl());
      }
    };
    chrome.runtime.onMessage.addListener(onMessage);
    return () => chrome.runtime.onMessage.removeListener(onMessage);
  });

  return <Context.Provider value={{ url }}>{props.children}</Context.Provider>;
};

export default PathMatch;

export const Match = ({ pattern, component, children }) => {
  const { url } = useContext(Context);

  const { isMatched, params } = useMemo(() => {
    const keys = [];
    const regexp = pathToRegexp(pattern, keys);
    const matched = regexp.exec(url);

    let isMatched = false;
    const params = {};
    if (matched) {
      isMatched = true;
      keys.forEach((key, idx) => (params[key.name] = matched[idx + 1]));
    }

    return { isMatched, params };
  }, [pattern, url]);

  if (!isMatched) {
    return null;
  }

  if (component) {
    return <component {...params} />;
  }

  if (typeof children === 'function') {
    return children(params);
  }

  return children;
};

Match.propTypes = {
  pattern: PropTypes.string.isRequired,
  component: PropTypes.any,
  children: PropTypes.func
};
