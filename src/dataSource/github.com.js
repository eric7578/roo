import axios from 'axios';

const github = axios.create({
  baseURL: 'https://api.github.com'
});

export default class Github {
  constructor({ owner, repo, token }) {
    this.prURLPattern = 'https\\://github.com/:owner/:repo/pull/:pr(/*)';
    this.commitURLPattern =
      'https://github.com/:owner/:repo/commit/:commit(/*)';
    this.treeURLPattern = 'https://github.com/:owner/:repo/tree/:head(/*)';
    this.blobURLPattern = 'https://github.com/:owner/:repo/blob/:head(/*)';
    this.fallbackURLPattern = 'https://github.com/:owner/:repo(/*)';

    this.owner = owner;
    this.repo = repo;
    if (token) {
      github.defaults.headers.Authorization = `token ${token}`;
    } else {
      delete github.defaults.headers.Authorization;
    }
  }

  searchFile(...keywrd) {
    const keywrds = keywrd.join('+');
    return github
      .get(`/search/code?q=filename:${keywrds}+repo:${this.owner}/${this.repo}`)
      .then(res => res.data.items);
  }

  searchCode(...keywrd) {
    const keywrds = keywrd.join('+');
    return github
      .get(`/search/code?q=${keywrds}+repo:${this.owner}/${this.repo}+in:file`)
      .then(res => res.data.items);
  }
}

// export function create(owner, repo, token) {

//   return {
//     getRepo() {
//       const tasks = [
//         github.get(`/repos/${owner}/${repo}`),
//         github.get(`/repos/${owner}/${repo}/branches`)
//       ];
//       return Promise.all(tasks).then(([repoResp, branchesResp]) => {
//         return {
//           defaultBranch: repoResp.data.default_branch,
//           branches: branchesResp.data
//         };
//       });
//     },
//     getNodes(sha) {
//       return github
//         .get(`/repos/${owner}/${repo}/git/trees/${sha}`)
//         .then(res => res.data.tree);
//     },
//     getPullRequest(pullNumber) {
//       return github
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
//       return github.get(`/repos/${owner}/${repo}/commits/${sha}`).then(res =>
//         res.data.files.map((o, index) => {
//           o.index = index;
//           o.path = o.filename;
//           return o;
//         })
//       );
//     },
//     navigateTo(path) {
//       const headers = { 'X-PJAX': true };
//       if (token) {
//         headers.Authorization = `token ${token}`;
//       }
//       return axios.get(path, { headers }).then(resp => {
//         const node = document.querySelector('main');
//         node.innerHTML = resp.data;
//         window.history.pushState(null, '', path);
//       });
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
//     }
//   };
// }
