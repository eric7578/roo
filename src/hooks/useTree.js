import { useCallback, useReducer } from 'react';
import produce from 'immer';

export default function useTree() {
  const [state, dispatch] = useReducer(reducer, {
    root: {
      tree: {}
    }
  });

  const buildTree = useCallback((nodes, nodeData) => {
    dispatch({
      type: 'buildTree',
      nodes,
      nodeData
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
      updateNode
    }
  ];
}

function reducer(state, action) {
  switch (action.type) {
    case 'buildTree':
      return {
        ...state,
        root: buildTree(action.nodes, action.nodeData)
      };

    case 'updateNode':
      return {
        ...state,
        root: updateNode(state.root, action.path, action.attrs)
      };
  }

  return state;
}

function buildTree(nodes, nodeData) {
  const root = {
    tree: {}
  };
  for (const node of nodes) {
    let treePt = root.tree;
    const path = node.path.split('/');
    path.forEach((p, index) => {
      if (treePt.hasOwnProperty(p)) {
        treePt = treePt[p].tree;
      } else {
        const pathSegs = path.slice(0, index + 1);
        const nextTreePt = {
          ...node,
          ...nodeData,
          path: pathSegs,
          fullPath: pathSegs.join('/'),
          tree: {}
        };
        treePt[p] = nextTreePt;
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
