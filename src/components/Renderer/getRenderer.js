import React from 'react';
import url from 'url';
import * as github from './github';

function parseRenderer() {
  const { hostname } = url.parse(window.location.href);
  switch (hostname) {
    case 'github.com':
      return github;
    default:
      throw new Error(`Can't find a renderer to support ${hostname}`);
  }
}

export default function getRenderer(additionalProps = {}) {
  return Object.entries(parseRenderer())
    .reduce((wrapper, [k, RendererComponent]) => {
      wrapper[k] = props => <RendererComponent {...additionalProps} {...props} />;
      return wrapper;
    }, {});
}