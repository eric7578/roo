import url from 'url';
import window from 'global/window';
import GithubDataSource from './GithubDataSource';

let dataSource;
const { hostname } = url.parse(window.location.href);

switch (hostname) {
  case 'github.com':
    dataSource = new GithubDataSource();
    break;
  default:
    throw new Error(`Can't find a datasource to support ${hostname}`);
}

export default dataSource;
