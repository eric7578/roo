export const ViewModes = {
  BROWSING: Symbol('browsinng'),
  SEARCH: Symbol('search'),
  CREDENTIALS: Symbol('credentials'),
  PREFERENCES: Symbol('preferences')
};

export const BrowsingModes = {
  TREE: Symbol('tree'),
  DIFF: Symbol('diff')
};

export const FileDiffStatus = {
  MODIFIED: Symbol.for('modified'),
  ADDED: Symbol.for('added'),
  REMOVED: Symbol.for('removed')
};
