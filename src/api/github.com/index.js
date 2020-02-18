import axios from 'axios';

export default function githubDataSource(token) {
  const github = axios.create({
    baseURL: 'https://api.github.com'
  });

  if (token) {
    github.defaults.headers.Authorization = `token ${token}`;
  }

  let repo;

  const loadRepo = async params => {
    if (!repo) {
      const res = await github.get(`/repos/${params.owner}/${params.repo}`);
      repo = res.data;
    }
    return repo;
  };

  return {
    urlPatterns: [
      '/:owner/:repo/pull/:pr/:rest*',
      '/:owner/:repo/commit/:commit/:rest*',
      '/:owner/:repo/tree/:ref/:fullPath*',
      '/:owner/:repo/blob/:ref/:fullPath*',
      '/:owner/:repo/:rest*'
    ],
    async searchFile(params, ...keywrd) {
      const keywrds = keywrd.join('+');
      const res = await github.get(
        `/search/code?q=filename:${keywrds}+repo:${params.owner}/${params.repo}`
      );
      return res.data.items;
    },
    async searchCode(params, ...keywrd) {
      const keywrds = keywrd.join('+');
      const res = await github.get(
        `/search/code?q=${keywrds}+repo:${params.owner}/${params.repo}+in:file`
      );
      return res.data.items;
    },
    async getSourceTreeNodes(params) {
      let res;
      if (params.ref) {
        res = await github.get(
          `/repos/${params.owner}/${params.repo}/git/trees/${params.ref}?recursive=1`
        );
      } else {
        const { default_branch } = await loadRepo(params);
        res = await github.get(
          `/repos/${params.owner}/${params.repo}/git/trees/${default_branch}?recursive=1`
        );
      }
      return res.data.tree.map(node => ({
        ...node,
        isDir: node.type === 'tree',
        isFile: node.type === 'blob',
        fullPath: node.path
      }));
    },
    async navigateNode(params, node) {
      let ref = params.ref;
      if (!ref) {
        const repo = await loadRepo(params);
        ref = repo.default_branch;
      }
      const navigateUrl = `https://github.com/${params.owner}/${params.repo}/blob/${ref}/${node.fullPath}`;
      const res = await axios.get(navigateUrl, {
        headers: {
          'X-PJAX': true,
          Authorization: `token ${token}`
        }
      });
      const $main = document.querySelector('main');
      $main.innerHTML = res.data;
      window.history.pushState(null, '', navigateUrl);
    }
  };
}
