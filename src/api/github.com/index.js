import axios from 'axios';
import { treeNodeTypes } from '../../enum';

export default function githubDataSource(token) {
  const github = axios.create({
    baseURL: 'https://api.github.com'
  });

  if (token) {
    github.defaults.headers.Authorization = `token ${token}`;
  }

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
    async getNodes(params, node) {
      let ref = node ? node.sha : params.ref;
      if (!ref) {
        // get default branch as ref
        const res = await github.get(`/repos/${params.owner}/${params.repo}`);
        ref = res.data.default_branch;
      }

      const res = await github.get(
        `/repos/${params.owner}/${params.repo}/git/trees/${ref}`
      );
      if (node) {
        return res.data.tree.map(node => ({
          ...node,
          type: node.type === 'blob' ? treeNodeTypes.FILE : treeNodeTypes.TREE
        }));
      }
      return res.data.tree.map(node => ({
        ...node,
        type: node.type === 'blob' ? treeNodeTypes.FILE : treeNodeTypes.TREE,
        fullPath: node.path
      }));
    }
  };
}
