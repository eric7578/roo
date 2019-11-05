import useTree from './useTree2';

const TREE = useTree.__get__('TREE');
const FILE = useTree.__get__('FILE');

const append = useTree.__get__('append');
const compress = useTree.__get__('compress');

test('append should initialize data structure with an array of nodes', () => {
  const state = append(new Map(), {
    path: 'src/components/useTree.js'
  });
  expect(state).toEqual(
    new Map()
      .set('src', {
        path: 'src',
        type: TREE,
        tree: new Set(['src/components'])
      })
      .set('src/components', {
        path: 'components',
        type: TREE,
        tree: new Set(['src/components/useTree.js'])
      })
      .set('src/components/useTree.js', {
        path: 'useTree.js',
        type: FILE
      })
  );
});

test('compress should compress tree node with only one child', () => {
  const state = compress(
    new Map()
      .set('src', {
        path: 'src',
        type: TREE,
        tree: new Set(['src/components'])
      })
      .set('src/components', {
        path: 'components',
        type: TREE,
        tree: new Set(['src/components/useTree.js'])
      })
      .set('src/components/useTree.js', {
        path: 'useTree.js',
        type: FILE
      })
  );

  expect(state).toEqual(
    new Map()
      .set('src/components', {
        path: 'src/components',
        type: TREE,
        tree: new Set(['src/components/useTree.js'])
      })
      .set('src/components/useTree.js', {
        path: 'useTree.js',
        type: FILE
      })
  );
});
