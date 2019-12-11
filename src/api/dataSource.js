import { dataSourceTypes } from '../enum';

export function selectDataSource(credentials) {
  const [token, dataSource] = selectCredential(credentials);
  if (!dataSourceTypes.includes(dataSource)) {
    const err = new Error(`Cannot find matching data source: ${dataSource}`);
    throw err;
  }
  return require(`./${dataSource}`).default(token);
}

function selectCredential(credentials) {
  const { hostname } = window.location;

  const config = credentials[hostname];
  if (!config) {
    return ['', hostname];
  }

  const token = config.tokens.find(token => token.selected);
  if (!token) {
    return ['', config.dataSource];
  }

  return [token.value, config.dataSource];
}
