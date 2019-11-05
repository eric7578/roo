import { useEffect, useReducer, useCallback } from 'react';
import { TREE, FILE } from '../types/TreeNodeTypes';

export default function useTree(initialNodes) {
  const [state, dispatch] = useReducer(reducer, initialNodes, init);

  const append = useCallback(node => {
    dispatch({ type: 'append', node });
  }, []);

  const initialize = useCallback(nodes => {
    dispatch({ type: 'init', nodes });
  }, []);

  const toggle = useCallback(absPath => {
    dispatch({ type: 'toggle', absPath });
  }, []);

  useEffect(() => {
    initialize(initialNodes);
  }, [initialNodes]);

  return {
    state,
    append,
    toggle,
    initialize
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'toggle':
      return toggle(state, action.absPath);
    case 'append':
      return append(state, action.node);
    case 'init':
      return init(action.nodes);
    default:
      return state;
  }
}

function toggle(state, absPath) {
  const node = state.get(absPath);
  return new Map(state).set(absPath, {
    ...node,
    isOpen: !node.isOpen
  });
}

function append(state, node) {
  const paths = node.path.split('/');
  let parentPath = '';
  let nodePath = '';

  paths.forEach((path, index) => {
    parentPath = nodePath;
    nodePath = nodePath ? `${nodePath}/${path}` : path;

    if (index === paths.length - 1) {
      // insert file node
      state.set(nodePath, {
        path,
        type: FILE
      });
    } else if (!state.has(nodePath)) {
      // insert tree node
      state.set(nodePath, {
        path,
        type: TREE,
        tree: []
      });
    }

    // insert into parent's tree
    if (index > 0) {
      const { tree, ...parentRest } = state.get(parentPath);
      state.set(parentPath, {
        ...parentRest,
        tree: new Set(tree).add(nodePath)
      });
    }
  });

  return state;
}

function init(nodes) {
  return compress(nodes.reduce(append, new Map()));
}

function compress(state) {
  const compressedAbsPaths = new Set();
  return Array.from(state.entries()).reduce((newState, [absPath, node]) => {
    if (node.type === FILE || node.tree.size > 1) {
      return newState.set(absPath, node);
    } else if (node.tree.size === 0 || compressedAbsPaths.has(absPath)) {
      return newState;
    }

    while (node.type === TREE && node.tree.size === 1) {
      const subNodeAbsPath = node.tree.values().next().value;
      const subNode = state.get(subNodeAbsPath);
      if (subNode.type === FILE) {
        break;
      }
      compressedAbsPaths.add(subNodeAbsPath);
      absPath = `${absPath}/${subNode.path}`;
      node.path = `${node.path}/${subNode.path}`;
      node.tree = subNode.tree;
    }

    return newState.set(absPath, node);
  }, new Map());
}
