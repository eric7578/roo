import axios from 'axios';

export default function create(opt) {
  console.log('crearte.......', opt);
  return {};
}

// const patterns = [
//   // pr
//   'https\\://github.com/:owner/:repo/pull/:pr(/*)',
//   // commit
//   'https://github.com/:owner/:repo/commit/:commit(/*)',
//   // tree
//   'https://github.com/:owner/:repo/tree/:head(/*)',
//   // blob
//   'https://github.com/:owner/:repo/blob/:head(/*)',
//   // default
//   'https://github.com/:owner/:repo(/*)'
// ];

// const regExp = pathToRegexp.compile('/user/:id');

// export default function github(owner, repo, token) {
//   const api = axios.create({
//     baseURL: 'https://api.github.com'
//   });

//   if (token) {
//     api.defaults.headers.Authorization = `token ${token}`;
//   }

//   return {
//     getRouteProperties() {
//       const patterns = [
//         // pr
//         'https\\://github.com/:owner/:repo/pull/:pr(/*)',
//         // commit
//         'https://github.com/:owner/:repo/commit/:commit(/*)',
//         // tree
//         'https://github.com/:owner/:repo/tree/:head(/*)',
//         // blob
//         'https://github.com/:owner/:repo/blob/:head(/*)',
//         // default
//         'https://github.com/:owner/:repo(/*)'
//       ];
//     },
//     getRepo() {
//       const tasks = [
//         api.get(`/repos/${owner}/${repo}`),
//         api.get(`/repos/${owner}/${repo}/branches`)
//       ];
//       return Promise.all(tasks).then(([repoResp, branchesResp]) => {
//         return {
//           defaultBranch: repoResp.data.default_branch,
//           branches: branchesResp.data
//         };
//       });
//     },
//     getNodes(sha) {
//       return api
//         .get(`/repos/${owner}/${repo}/git/trees/${sha}`)
//         .then(res => res.data.tree);
//     },
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
//     },
//     searchFile(...keywrd) {
//       const keywrds = keywrd.join('+');
//       return api
//         .get(
//           `/search/code?q=filename:${keywrds}+repo:${this.owner}/${this.repo}`
//         )
//         .then(res => res.data.items);
//     },
//     searchCode(...keywrd) {
//       const keywrds = keywrd.join('+');
//       return api
//         .get(
//           `/search/code?q=${keywrds}+repo:${this.owner}/${this.repo}+in:file`
//         )
//         .then(res => res.data.items);
//     }
//   };
// }
