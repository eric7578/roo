import url from 'url';
import window from 'global/window';
import GithubDataSource from './GithubDataSource';

export default function getDataSource() {
  const { hostname } = url.parse(window.location.href);
  switch (hostname) {
    case 'github.com':
      return new GithubDataSource();
    default:
      throw new Error(`Can't find a datasource to support ${hostname}`);
  }
}