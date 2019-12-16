import makeTreeSelectors from './makeTreeSelectors';
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
