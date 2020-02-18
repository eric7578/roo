import makeTreeSelectors, { createRootNodesSelctor } from './makeTreeSelectors';
import { treeNodeTypes, treeTypes } from '../../enum';

const sortNodes = makeTreeSelectors.__get__('sortNodes');

test('sortNodes should sort nodes in the order of Tree, File and alphabet', () => {
  const nodes = [
    { path: '.gitignore', isFile: true },
    { path: 'test', isFile: false },
    { path: 'App.js', isFile: true },
    { path: 'src', isFile: false }
  ];
  expect(nodes.sort(sortNodes)).toEqual([
    { path: 'src', isFile: false },
    { path: 'test', isFile: false },
    { path: '.gitignore', isFile: true },
    { path: 'App.js', isFile: true }
  ]);
});

test('createRootNodesSelctor should create selecor to select root nodes', () => {
  const selector = createRootNodesSelctor(treeTypes.TREE);
  const tree = new Map([
    ['src', { path: 'src' }],
    ['tool', { path: 'tool' }],
    ['src/components', { path: 'components' }]
  ]);
  const state = {
    tree: new Map([[treeTypes.TREE, tree]])
  };

  const rootNodes = selector(state);
  expect(rootNodes).toEqual([tree.get('src'), tree.get('tool')]);
});
