import axios from 'axios';

export const patterns = [
  'https\\://github.com/:owner/:repo/pull/:pr(/*)',       // pr
  'https\\://github.com/:owner/:repo/commit/:commit(/*)', // commit
  'https\\://github.com/:owner/:repo/tree/:head(/*)',     // tree
  'https\\://github.com/:owner/:repo/blob/:head(/*)',     // blob
  'https\\://github.com/:owner/:repo(/*)'                 // other pages, simply show explorer
];

export function create(owner, repo, token) {
  const github = axios.create({
    baseURL: 'https://api.github.com'
  });

  if (token) {
    github.defaults.headers.Authorization = `token ${token}`;
  } else {
    delete github.defaults.headers.Authorization;
  }

  return {
    pjaxContainer: 'main',
    getRepo() {
      const tasks = [
        github.get(`/repos/${owner}/${repo}`),
        github.get(`/repos/${owner}/${repo}/branches`)
      ];
      return Promise.all(tasks)
        .then(([repoResp, branchesResp]) => {
          return {
            defaultBranch: repoResp.data.default_branch,
            branches: branchesResp.data
          };
        });
    },
    getNodes(sha) {
      return github.get(`/repos/${owner}/${repo}/git/trees/${sha}`)
        .then(res => res.data.tree);
    },
    searchFile(...keywrd) {
      const keywrds = keywrd.join('+');
      return github.get(`/search/code?q=filename:${keywrds}+repo:${owner}/${repo}`)
        .then(res => res.data.items);
    },
    searchCode(...keywrd) {
      const keywrds = keywrd.join('+');
      return github.get(`/search/code?q=${keywrds}+repo:${owner}/${repo}+in:file`)
        .then(res => res.data.items);
    },
    getPullRequest(pullNumber) {
      return github.get(`/repos/${owner}/${repo}/pulls/${pullNumber}/files`)
        .then(res => res.data.map((o, index) => {
          o.index = index;
          o.path = o.filename;
          return o;
        }));
    },
    getCommit(sha) {
      return github.get(`/repos/${owner}/${repo}/commits/${sha}`)
        .then(res => res.data.files.map((o, index) => {
          o.index = index;
          o.path = o.filename;
          return o;
        }));
    },
    pjax(path) {
      const headers = {'X-PJAX': true};
      if (token) {
        headers.Authorization = `token ${token}`;
      }
      return axios.get(path, {headers}).then(resp => resp.data);
    },
    getHeadNodePath(node, dataSource) {
      const path = [
        'https://github.com',
        dataSource.owner,
        dataSource.repo,
        'blob',
        dataSource.head || dataSource.defaultBranch,
        ...node.parentPath,
        node.path
      ];
      return path.join('/');
    },
    getPrNodePath(node, dataSource) {
      const path = [
        'https://github.com',
        dataSource.owner,
        dataSource.repo,
        'pull',
        dataSource.pr,
        'files'
      ];
      return `${path.join('/')}#diff-${node.index}`
    },
    getCommitNodePath(node, dataSource) {
      const path = [
        'https://github.com',
        dataSource.owner,
        dataSource.repo,
        'commit',
        dataSource.commit
      ];
      return `${path.join('/')}#diff-${node.index}`
    }
  };
}
