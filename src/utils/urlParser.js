import pathToRegexp from 'path-to-regexp';

export function createURLParser(patterns) {
  patterns = patterns.map(pattern => {
    pattern.keys = [];
    pattern.regExp = pathToRegexp(pattern.path, pattern.keys);
    return pattern;
  });

  return path => {
    for (const pattern of patterns) {
      const args = pattern.regExp.exec(path);
      if (args) {
        const routeParams = args.slice(1);
        const params = pattern.keys.reduce((params, key, index) => {
          params[key.name] = routeParams[index];
          return params;
        }, {});
        return {
          ...pattern,
          params
        };
      }
    }
  };
}
