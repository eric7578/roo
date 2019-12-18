import makeTreeSelectors, {
  nextPrefetchNodeSelectorCreator
} from './makeTreeSelectors';
import { treeNodeTypes } from '../../enum';

const sortNodes = makeTreeSelectors.__get__('sortNodes');

test('sortNodes should sort nodes in the order of Tree, File and alphabet', () => {
  const nodes = [
    { path: '.gitignore', type: treeNodeTypes.FILE },
    { path: 'test', type: treeNodeTypes.TREE },
    { path: 'App.js', type: treeNodeTypes.FILE },
    { path: 'src', type: treeNodeTypes.TREE }
  ];
  expect(nodes.sort(sortNodes)).toEqual([
    { path: 'src', type: treeNodeTypes.TREE },
    { path: 'test', type: treeNodeTypes.TREE },
    { path: '.gitignore', type: treeNodeTypes.FILE },
    { path: 'App.js', type: treeNodeTypes.FILE }
  ]);
});

test('nextPrefetchNodeSelectorCreator should select next node in fullPath, if the node is lack of tree', () => {
  const selector = nextPrefetchNodeSelectorCreator();
  const nextPrefetchNode = selector({
    vars: {
      params: { fullPath: 'src/components/Tree.js' }
    },
    tree: new Map([
      [
        'src',
        {
          type: treeNodeTypes.TREE,
          path: 'src',
          tree: new Set(['src/components'])
        }
      ],
      [
        'src/components',
        {
          type: treeNodeTypes.TREE,
          path: 'components'
        }
      ],
      [
        'src/components/Tree.js',
        {
          type: treeNodeTypes.FILE,
          path: 'Tree.js'
        }
      ]
    ])
  });

  expect(nextPrefetchNode).toEqual({
    type: treeNodeTypes.TREE,
    path: 'components'
  });
});
