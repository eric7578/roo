import React, { createContext, useState, useContext } from 'react';
import { Repository } from './WithRepository';
import url from 'url';
import * as GithubRenderer from './GithubRenderer';

export const Renderer = createContext(null);

function getRenderer() {
  const { hostname } = url.parse(window.location.href);
  switch (hostname) {
    case 'github.com':
      return GithubRenderer;
    default:
      throw new Error(`Can't find a renderer to support ${hostname}`);
  }
}

function wrapRenderer(mixinProps = {}) {
  return Object.entries(getRenderer())
    .reduce((wrapper, [k, RendererComponent]) => {
      wrapper[k] = props => <RendererComponent {...mixinProps} {...props} />;
      return wrapper;
    }, {});
}

const WithRenderer = props => {
  const repository = useContext(Repository);
  const [renderer, setRenderer] = useState(() => wrapRenderer({
    repository
  }));

  return (
    <Renderer.Provider
      {...props}
      value={renderer}
    />
  );
}


export default WithRenderer;
