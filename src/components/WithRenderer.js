import React, { createContext, useState } from 'react';
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

const WithRenderer = props => {
  const [renderer, setRenderer] = useState(getRenderer);

  return (
    <Renderer.Provider
      {...props}
      value={renderer}
    />
  );
}


export default WithRenderer;
