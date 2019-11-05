import axios from 'axios';
import * as TabTypes from '../types/TabTypes';
import { createURLParser } from '../utils/urlParser';

const urlParser = createURLParser([
  { tabType: TabTypes.PR, path: '/:owner/:repo/pull/:pr/:rest*' },
  { tabType: TabTypes.COMMIT, path: '/:owner/:repo/commit/:commit/:rest*' },
  { tabType: TabTypes.SOURCE, path: '/:owner/:repo/tree/:head/:rest*' },
  { tabType: TabTypes.BLOB, path: '/:owner/:repo/blob/:head/:rest*' },
  { tabType: TabTypes.SOURCE, path: '/:owner/:repo/:rest*' }
]);

class Github {
  constructor(token) {
    this.api = axios.create({
      baseURL: 'https://api.github.com'
    });
    if (token) {
      this.api.defaults.headers.Authorization = `token ${token}`;
    }

    this.token = token;
    this.params = {};
  }

  onPathChanged() {
    const result = urlParser(window.location.pathname);
    if (!result) {
      return null;
    }
    this.params = result.params;
    return result.tabType;
  }

  async getBranches() {
    const { owner, repo } = this.params;
    const [repoResp, branchesResp] = await Promise.all([
      this.api.get(`/repos/${owner}/${repo}`),
      this.api.get(`/repos/${owner}/${repo}/branches`)
    ]);
    this.defaultBranch = repoResp.data.default_branch;
    this.branches = branchesResp.data;
  }

  async onSearchFile(...keywrd) {
    const { owner, repo } = this.params;
    const keywrds = keywrd.join('+');
    const res = await this.api.get(
      `/search/code?q=filename:${keywrds}+repo:${owner}/${repo}`
    );
    return res.data.items;
  }

  async onSearchCode(...keywrd) {
    const { owner, repo } = this.params;
    const keywrds = keywrd.join('+');
    const res = await this.api.get(
      `/search/code?q=${keywrds}+repo:${owner}/${repo}+in:file`
    );
    return res.data.items;
  }

  async onGetNodes(sha) {
    const { owner, repo, head } = this.params;
    const ref = sha || head || this.defaultBranch;
    const res = await this.api.get(`/repos/${owner}/${repo}/git/trees/${ref}`);
    return res.data.tree;
  }

  async onNavigate(tabType, parentPath, path) {
    const headers = { 'X-PJAX': true };
    if (this.token) {
      headers.Authorization = `token ${this.token}`;
    }
    const navigateUrl = this.makeUrl(tabType, [...parentPath, path]);
    const res = await axios.get(navigateUrl, { headers });
    const node = document.querySelector('main');
    node.innerHTML = res.data;
    window.history.pushState(null, '', navigateUrl);
  }

  makeUrl(tabType, paths) {
    let path;
    switch (tabType) {
      case TabTypes.SEARCH:
        path = [
          'https://github.com',
          this.params.owner,
          this.params.repo,
          'blob',
          this.params.head || this.defaultBranch,
          ...paths
        ];
    }

    return path.join('/');
  }
}

export const init = async ({ token }) => {
  const instance = new Github(token);
  instance.onPathChanged();
  await instance.getBranches();
  return instance;
};

// export default function github(owner, repo, token) {
//   return {
//     getPullRequest(pullNumber) {
//       return api
//         .get(`/repos/${owner}/${repo}/pulls/${pullNumber}/files`)
//         .then(res =>
//           res.data.map((o, index) => {
//             o.index = index;
//             o.path = o.filename;
//             return o;
//           })
//         );
//     },
//     getCommit(sha) {
//       return api.get(`/repos/${owner}/${repo}/commits/${sha}`).then(res =>
//         res.data.files.map((o, index) => {
//           o.index = index;
//           o.path = o.filename;
//           return o;
//         })
//       );
//     },
//     getHeadNodePath(node, dataSource) {
//       const path = [
//         'https://github.com',
//         dataSource.owner,
//         dataSource.repo,
//         'blob',
//         dataSource.head || dataSource.defaultBranch,
//         ...node.parentPath,
//         node.path
//       ];
//       return path.join('/');
//     },
//     getPrNodePath(node, dataSource) {
//       const path = [
//         'https://github.com',
//         dataSource.owner,
//         dataSource.repo,
//         'pull',
//         dataSource.pr,
//         'files'
//       ];
//       return `${path.join('/')}#diff-${node.index}`;
//     },
//     getCommitNodePath(node, dataSource) {
//       const path = [
//         'https://github.com',
//         dataSource.owner,
//         dataSource.repo,
//         'commit',
//         dataSource.commit
//       ];
//       return `${path.join('/')}#diff-${node.index}`;
//     },
//   };
// }
