import axios from 'axios';

export function create(owner, repo, token) {
  const github = axios.create({
    baseURL: 'https://api.github.com'
  });

  if (token) {
    github.defaults.headers.Authorization = `token ${token}`;
  }

  return {
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
    searchPath(...keywrd) {
      const keywrds = keywrd.join('+');
      return github.get(`/search/code?q=${keywrds}+repo:${owner}/${repo}+in:path`)
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
    }
  };
}
