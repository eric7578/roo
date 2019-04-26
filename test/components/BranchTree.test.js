import { appendTreeNode } from '../../src/components/BranchTree';

const startNode = {
  tree: [
    {
      sha: '0.0',
      tree: [
        { sha: '1.0' },
        { sha: '1.1' }
      ]
    },
    { sha: '0.1' }
  ]
};

describe('appendTreeNode', () => {
  it('will append to current node if sha is matched', () => {
    const tree = appendTreeNode({ sha: 'master' }, 'master', [{ sha: '0.1' }]);

    expect(tree).toEqual({
      sha: 'master',
      tree: [
        { sha: '0.1' }
      ]
    });
  });

  it('will append tree to node which has the matching sha', () => {
    const tree = appendTreeNode(startNode, '1.0', [{ sha: '2.0' }]);

    expect(tree).toEqual({
      tree: [
        {
          sha: '0.0',
          tree: [
            {
              sha: '1.0',
              tree: [
                { sha: '2.0' }
              ]
            },
            { sha: '1.1' }
          ]
        },
        { sha: '0.1' }
      ]
    });
  });
});
