function compress(raw) {
  return raw.map(({ name, token, asDefault }) => {
    const compressed = {
      n: name,
      t: token
    };
    if (asDefault) {
      compressed.d = 1;
    }
    return compressed;
  });
}

function decompress(compressed) {
  return compressed.map(({ n, t, d }) => {
    return {
      name: n,
      token: t,
      asDefault: d === 1
    };
  });
}

export default class DataSource {
  constructor() {
    this.bindFunctions();
    this.syncAuth();
    this.syncParams();
  }

  bindFunctions() {
    this.getRepo = this.getRepo.bind(this);
    this.getNodes = this.getNodes.bind(this);
    this.searchPath = this.searchPath.bind(this);
    this.getPullRequest = this.getPullRequest.bind(this);
  }

  setAuth(auth) {
    localStorage.setItem('roo.auth', JSON.stringify(compress(auth)));
  }

  getAuth() {
    const c = localStorage.getItem('roo.auth');
    if (c) {
      return decompress(JSON.parse(c));
    }
    return [];
  }

  getDefaultAuth() {
    const auth = this.getAuth();
    const defaultAuth = auth.find(({ asDefault }) => asDefault);
    return defaultAuth;
  }

  parseParams(...patterns) {
    for (const pattern of patterns) {
      const params = pattern.match(window.location.href);
      if (params) {
        return params;
      }
    }
  }

  syncAuth() {
    throw new Error(`DataSource.syncAuth is not implemented`);
  }

  syncParams() {
    throw new Error(`DataSource.syncParams is not implemented`);
  }

  getRepo() {
    throw new Error(`DataSource.getBranches is not implemented`);
  }

  getNodes(sha) {
    throw new Error(`DataSource.getNodes is not implemented`);
  }

  searchPath(...keywrd) {
    throw new Error(`DataSource.searchPath is not implemented`);
  }

  getPullRequest(pullNumber) {
    throw new Error(`DataSource.getPullRequest is not implemented`);
  }
}