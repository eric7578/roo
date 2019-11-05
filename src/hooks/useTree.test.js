import { testHook } from '../../test/testUtil';
import useTree, { mutatePathIn, collapseToTree, appendTreeNode, FILE, ROOT_SHA } from './useTree';

describe('useTree', () => {
  describe('appendTreeNode', () => {
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

  describe('mutatePathIn', () => {
    it('should create keys that is not existed', () => {
      const obj = {};
      mutatePathIn(obj, 'a/b');
      expect(obj).toEqual({
        a: {
          b: {
            path: 'b',
            [FILE]: true
          }
        }
      });
    });

    it('should mutate keys in depth', () => {
      const obj = { a: { } };
      mutatePathIn(obj, 'a/b');
      expect(obj).toEqual({
        a: {
          b: {
            path: 'b',
            [FILE]: true
          }
        }
      });
    });
  });

  describe('collapseToTree', () => {
    it('should dig into next tree nodes if there is only one node in the tree', () => {
      const obj = {
        a: {
          b: {
            c1: {},
            c2: {}
          }
        }
      };
      expect(collapseToTree(obj)).toEqual([
        {
          type: 'tree',
          path: 'a/b',
          tree: [
            {
              type: 'tree',
              path: 'c1',
              tree: []
            },
            {
              type: 'tree',
              path: 'c2',
              tree: []
            }
          ]
        }
      ]);
    });

    it('should dig into next tree nodes if there is only one node in the tree', () => {
      const obj = {
        a: {
          b: {
            'c.js': {
              path: 'c.js',
              [FILE]: true
            }
          }
        }
      };
      expect(collapseToTree(obj)).toEqual([
        {
          type: 'tree',
          path: 'a/b',
          tree: [
            {
              type: 'blob',
              path: 'c.js'
            }
          ]
        }
      ]);
    });
  });

  describe('useTree', () => {
    const testSets = [
      // test single node
      {
        testName: 'test single node',
        givenPath: [
          { path: 'path/to/file.js' }
        ],
        expectTree: [
          {
            type: 'tree',
            path: 'path/to',
            tree: [
              {
                type: 'blob',
                path: 'file.js'
              }
            ]
          }
        ]
      },
      // test same directory
      {
        givenPath: [
          { path: 'some/path/to/file1.js' },
          { path: 'some/path/to/file2.js' }
        ],
        expectTree: [
          {
            type: 'tree',
            path: 'some/path/to',
            tree: [
              {
                type: 'blob',
                path: 'file1.js'
              },
              {
                type: 'blob',
                path: 'file2.js'
              }
            ]
          }
        ]
      },
      // test nested directory
      {
        givenPath: [
          { path: 'file1.js' },
          { path: 'some/path/to/file2.js' },
          { path: 'some/path/for/another/file3.js' }
        ],
        expectTree: [
          {
            type: 'tree',
            path: 'some/path',
            tree: [
              {
                type: 'tree',
                path: 'to',
                tree: [
                  {
                    type: 'blob',
                    path: 'file2.js'
                  }
                ]
              },
              {
                type: 'tree',
                path: 'for/another',
                tree: [
                  {
                    type: 'blob',
                    path: 'file3.js'
                  }
                ]
              }
            ]
          },
          {
            type: 'blob',
            path: 'file1.js'
          }
        ]
      }
    ];

    testSets.forEach(({ givenPath, expectTree }, i) => {
      it(`should turn flatten paths to a structured tree, test set: ${i + 1}`, () => {
        let state;

        testHook(() => {
          const tree = useTree(givenPath);
          state = tree.state;
        });

        expect(state).toEqual({
          sha: ROOT_SHA,
          type: 'tree',
          tree: expectTree
        });
      });
    });
  });
});


