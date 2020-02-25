import { dataSourceTypes } from '../enum';

export function selectDataSource(credentials) {
  const [token, dataSource] = selectCredential(credentials);
  if (!dataSourceTypes.includes(dataSource)) {
    const err = new Error(`Cannot find matching data source: ${dataSource}`);
    throw err;
  }
  return require(`./${dataSource}`).default(token);
}

