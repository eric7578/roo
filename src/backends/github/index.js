export async function applyModule() {
  return window.location.host === 'github.com';
}

export async function loadModule(token) {
  return {
    patterns: [
      '/:owner/:repo',
      '/:owner/:repo/commit/:commit',
      '/:owner/:repo/pull/:pr',
      '/:owner/:repo/tree/:head',
      '/:owner/:repo/blob/:head'
    ]
  };
}
