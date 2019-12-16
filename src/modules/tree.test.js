import tree from './tree';
import { treeNodeTypes } from '../enum';

const append = tree.__get__('append');
const appendTo = tree.__get__('appendTo');
const compress = tree.__get__('compress');

test('append should parse full path into an array of nodes', () => {
  const state = append(new Map(), 'src/tree.js', { type: treeNodeTypes.FILE });
  expect(state).toEqual(
    new Map([
      [
        'src',
        {
          path: 'src',
          fullPath: 'src',
          type: treeNodeTypes.TREE,
          tree: new Set(['src/tree.js'])
        }
      ],
      [
        'src/tree.js',
        {
          path: 'tree.js',
          fullPath: 'src/tree.js',
          type: treeNodeTypes.FILE
        }
      ]
    ])
  );
});

test('appendTo should add node into corresponding node by relative path', () => {
  const state = new Map([
    [
      'src',
      {
        fullPath: 'src',
        path: 'src',
        type: treeNodeTypes.TREE
      }
    ]
  ]);
  const nextState = appendTo(state, { fullPath: 'src' }, [
    { type: treeNodeTypes.FILE, path: 'tree.js' }
  ]);
  expect(nextState).toEqual(
    new Map([
      [
        'src',
        {
          path: 'src',
          fullPath: 'src',
          type: treeNodeTypes.TREE,
          tree: new Set(['src/tree.js'])
        }
      ],
      [
        'src/tree.js',
        {
          path: 'tree.js',
          fullPath: 'src/tree.js',
          type: treeNodeTypes.FILE
        }
      ]
    ])
  );
});

test('compress should compress tree node with only one child', () => {
  const state = compress(
    new Map([
      [
        'src',
        {
          path: 'src',
          type: treeNodeTypes.TREE,
          tree: new Set(['src/components'])
        }
      ],
      [
        'src/components',
        {
          path: 'components',
          type: treeNodeTypes.TREE,
          tree: new Set(['src/components/useTree.js'])
        }
      ],
      [
        'src/components/useTree.js',
        {
          path: 'useTree.js',
          type: treeNodeTypes.FILE
        }
      ]
    ])
  );

  expect(state).toEqual(
    new Map([
      [
        'src/components',
        {
          path: 'src/components',
          type: treeNodeTypes.TREE,
          tree: new Set(['src/components/useTree.js'])
        }
      ],
      [
        'src/components/useTree.js',
        {
          path: 'useTree.js',
          type: treeNodeTypes.FILE
        }
      ]
    ])
  );
});
