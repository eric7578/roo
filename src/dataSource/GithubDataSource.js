import axios from 'axios';
import UrlPattern from 'url-pattern';
import DataSource from './DataSource';

export default class GithubDataSource extends DataSource {
  syncAuth() {
    // set token
    const auth = this.getDefaultAuth();
    this.github = axios.create({
      baseURL: 'https://api.github.com'
    });
    if (auth) {
      this.github.defaults.headers.Authorization = `token ${auth.token}`;
    }
  }

  syncParams() {
    this.params = this.parseParams(
      // pr
      new UrlPattern('https\\://github.com/:owner/:repo/pull/:pr(/*)'),
      // index, tree, blob, commit
      new UrlPattern('https\\://github.com/:owner/:repo(/:type)'),
      new UrlPattern('https\\://github.com/:owner/:repo(/:type/:head(/*))')
    );

    return this.params;
  }

  getRepo() {
    const { owner, repo } = this.params;
    return Promise.all([
        this.github.get(`/repos/${owner}/${repo}`),
        this.github.get(`/repos/${owner}/${repo}/branches`)
      ])
      .then(resp => resp.map(res => res.data))
      .then(([repo, branches]) => {
        return {
          defaultBranch: repo.default_branch,
          branches
        };
      });
  }

  getNodes(sha) {
    const { owner, repo } = this.params;
    return this.github
      .get(`/repos/${owner}/${repo}/git/trees/${sha}`)
      .then(res => res.data.tree);
  }

  searchPath(...keywrd) {
    const { owner, repo } = this.params;
    const keywrds = keywrd.join('+');
    return this.github
      .get(`/search/code?q=${keywrds}+repo:${owner}/${repo}+in:path`)
      .then(res => res.data.items);
  }

  getPullRequest(pullNumber) {
    const { owner, repo } = this.params;
    return this.github
      .get(`/repos/${owner}/${repo}/pulls/${pullNumber}/files`)
      .then(res => res.data.map((o, index) => {
        o.index = index;
        o.path = o.filename;
        return o;
      }));
  }
}
