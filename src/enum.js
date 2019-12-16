export const dataSourceTypes = process.env.DATA_SOURCES;

export const tabTypes = {
  SEARCH: Symbol('SEARCH'),
  CREDENTIALS: Symbol('CREDENTIALS'),
  SETTINGS: Symbol('SETTINGS'),
  TREE: Symbol('TREE')
};

export const treeNodeTypes = {
  TREE: Symbol('TREE'),
  FILE: Symbol('FILE')
};
