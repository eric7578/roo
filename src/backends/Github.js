export const patterns = {
  main: '/:owner/:repo'
};

export default class Github {
  constructor(owner, repo) {
    console.log({
      owner,
      repo
    });
  }
}
