import tree from './tree';
import { treeNodeTypes } from '../enum';

const append = tree.__get__('append');
const appendTo = tree.__get__('appendTo');
const createTree = tree.__get__('createTree');
const compressTree = tree.__get__('compressTree');

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

test('createTree should create tree with array of nodes', () => {
  const nodes = [
    { fullPath: 'src/modules/tree.js' },
    { fullPath: 'src/modules/tree.test.js' }
  ];
  const tree = createTree(nodes);

  expect(tree.get('src')).toMatchObject({
    path: 'src',
    fullPath: 'src',
    tree: new Set(['src/modules'])
  });
  expect(tree.get('src/modules')).toMatchObject({
    path: 'modules',
    fullPath: 'src/modules',
    tree: new Set(['src/modules/tree.js', 'src/modules/tree.test.js'])
  });
  expect(tree.get('src/modules/tree.js')).toMatchObject({
    fullPath: 'src/modules/tree.js',
    path: 'tree.js'
  });
  expect(tree.get('src/modules/tree.test.js')).toMatchObject({
    fullPath: 'src/modules/tree.test.js',
    path: 'tree.test.js'
  });
});

test('compressTree should compress tree nodes with only one child', () => {
  const tree = new Map();
  tree
    .set('src', {
      path: 'src',
      tree: new Set(['src/modules'])
    })
    .set('src/modules', {
      path: 'modules',
      tree: new Set(['src/modules/tree.js', 'src/modules/tree.test.js'])
    })
    .set('src/modules/tree.js', {
      path: 'tree.js'
    })
    .set('src/modules/tree.test.js', {
      path: 'tree.test.js'
    });
  compressTree(tree);

  expect(tree.get('src/modules')).toMatchObject({
    path: 'src/modules',
    tree: new Set(['src/modules/tree.js', 'src/modules/tree.test.js'])
  });
  expect(tree.get('src/modules/tree.js')).toMatchObject({
    path: 'tree.js'
  });
  expect(tree.get('src/modules/tree.test.js')).toMatchObject({
    path: 'tree.test.js'
  });
});
