import axios from 'axios';

export default function githubDataSource(token) {
  const github = axios.create({
    baseURL: 'https://api.github.com'
  });

  if (token) {
    github.defaults.headers.Authorization = `token ${token}`;
  }

  return {
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
    }
  };
}
