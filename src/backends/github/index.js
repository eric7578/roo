import axios from 'axios';
import { BrowsingModes } from '../../enum';

export async function applyModule() {
  return window.location.host === 'github.com';
}

export async function loadModule(token) {
  const github = axios.create({
    baseURL: 'https://api.github.com'
  });
  if (token) {
    github.defaults.headers.Authorization = `token ${token}`;
  }

  return {
    browser: [
      [
        BrowsingModes.TREE,
        '/:owner/:repo',
        '/:owner/:repo/tree/:head',
        '/:owner/:repo/tree/:head/(.*)',
        '/:owner/:repo/blob/:head',
        '/:owner/:repo/commit/:commit'
      ],
      [BrowsingModes.DIFF, '/:owner/:repo/pull/:pr']
    ],
    async loadTree({ owner, repo, head }) {
      if (!head) {
        const resp = await github.get(`/repos/${owner}/${repo}`);
        head = resp.data.default_branch;
      }
      const resp = await github.get(
        `/repos/${owner}/${repo}/git/trees/${head}?recursive=1`
      );
      return resp.data.tree;
    },
    async search({ owner, repo }, { keyword, type }) {
      let query;
      switch (type) {
        case 'filename':
          query = `repo:${owner}/${repo}+filename:${keyword}`;
          break;

        case 'code':
          query = `repo:${owner}/${repo}+${keyword}+in:file`;
          break;
      }
      const resp = await github.get(`/search/code?q=${query}`);
      return resp.data.items;
    }
  };
}
