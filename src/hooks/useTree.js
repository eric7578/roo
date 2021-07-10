import { useCallback, useReducer } from 'react';
import produce from 'immer';

export default function useTree() {
  const [state, dispatch] = useReducer(reducer, {
    root: {
      tree: {}
    }
  });

  const buildTree = useCallback((nodes, compressed = false) => {
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

  const updateNode = useCallback((path, attrs) => {
    dispatch({
      type: 'updateNode',
      path,
      attrs
    });
  }, []);

  return [
    state.root.tree,
    {
      buildTree,
      compressTree,
      updateNode
    }
  ];
}

function reducer(state, action) {
  switch (action.type) {
    case 'buildTree':
      return {
        ...state,
        raw: [...action.nodes],
        root: buildTree(formatNodes(action.nodes, action.compressed))
      };

    case 'compressTree':
      return {
        ...state,
        root: buildTree(formatNodes(state.raw, action.compressed))
      };

    case 'updateNode':
      return {
        ...state,
        root: updateNode(state.root, action.path, action.attrs)
      };
  }

  return state;
}

function formatNodes(nodes, compressed) {
  if (compressed) {
    return nodes;
  } else {
    return nodes.map(node => ({
      ...node,
      path: node.path.split('/')
    }));
  }
}

function buildTree(nodes) {
  const root = {
    tree: {}
  };
  for (const node of nodes) {
    let treePt = root.tree;
    node.path.forEach((path, index) => {
      if (treePt.hasOwnProperty(path)) {
        treePt = treePt[path].tree;
      } else {
        const nextTreePt = {
          ...node,
          tree: {}
        };
        treePt[path] = nextTreePt;
        treePt = nextTreePt.tree;
      }
    });
  }
  return root;
}

function updateNode(root, path, attrs) {
  return produce(root, patch => {
    const node = path.reduce((node, p) => {
      node = node.tree[p];
      return node;
    }, patch);
    for (const [key, value] of Object.entries(attrs)) {
      node[key] = value;
    }
  });
}
