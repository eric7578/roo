import { useCallback, useReducer } from 'react';

export default function useTree() {
  const [state, dispatch] = useReducer(reducer, {
    root: {}
  });

  const buildTree = useCallback((nodes, compressed) => {
    dispatch({
      type: 'buildTree',
      nodes,
      compressed
    });
  }, []);

  const compressTree = useCallback(compressed => {
    dispatch({
      type: 'compressTree',
      compressed
    });
  }, []);

  return [
    state.root,
    {
      buildTree,
      compressTree
    }
  ];
}

function reducer(state, action) {
  switch (action.type) {
    case 'buildTree':
      return {
        ...state,
        raw: action.nodes,
        root: buildTree(formatNodes(action.nodes, action.compressed))
      };

    case 'compressTree':
      return {
        ...state,
        root: buildTree(formatNodes(state.raw, action.compressed))
      };
  }
  return state;
}

function formatNodes(nodes, compressed) {
  if (compressed) {
    return nodes;
  } else {
    return nodes.map(node => {
      node.path = node.path.split('/');
      return node;
    });
  }
}

function buildTree(nodes) {
  const root = initialState();
  for (const node of nodes) {
    let treePt = root.path;
    node.path.forEach((path, index, paths) => {
      const isFile = paths.length === index - 1;
      if (treePt.path.hasOwnProperty(path)) {
        treePt = treePt[path].path;
      } else {
        const nextTreePt = {
          isFile,
          path: {}
        };
        treePt.tree[path] = nextTreePt;
        treePt = nextTreePt.path;
      }
    });
  }
  return root;
}
