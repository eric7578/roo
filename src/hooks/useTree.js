import { useReducer, useEffect, useState } from 'react';

const EXPAND_TREE = 'useTree/EXPAND_TREE';
const INITIALIZE = 'useTree/INITIALIZE';

export const ROOT_SHA = Symbol();
export const FILE = Symbol();

export default function useTree(flattenTree) {
  const [state, dispatch] = useReducer(reducer, initialize());

  const expandTree = (sha, tree) => dispatch({
    type: EXPAND_TREE,
    sha,
    tree
  });

  const resetTree = () => dispatch({
    type: INITIALIZE
  });

  useEffect(() => {
    if (Array.isArray(flattenTree) && flattenTree.length > 0) {
      const obj = {};
      flattenTree.forEach(node => mutatePathIn(obj, node.path, node));
      resetTree();
      expandTree(ROOT_SHA, collapseToTree(obj));
    }
  }, [flattenTree]);

  return {
    state,
    expandTree,
    resetTree
  };
}

function reducer(state, action) {
  switch (action.type) {
    case INITIALIZE:
      return initialize();
    case EXPAND_TREE:
      action.tree.sort(sortNodes);
      return appendTreeNode(state, action.sha, action.tree);
    default:
      return state;
  }
}

function initialize() {
  return {
    sha: ROOT_SHA,
    type: 'tree'
  };
}

function sortNodes(n1, n2) {
  return n1.type === 'tree' && n2.type !== 'tree' ? -1 : 1;
}

export function appendTreeNode(startNode, sha, tree) {
  if (startNode.sha === sha) {
    return {
      ...startNode,
      tree
    };
  }

  if (!Array.isArray(startNode.tree)) {
    return startNode;
  }

  const matchedIndex = startNode.tree.findIndex(n => n.sha === sha);
  if (matchedIndex > -1) {
    // replace current tree
    const nextTree = [...startNode.tree];
    nextTree[matchedIndex] = {
      ...nextTree[matchedIndex],
      tree
    };
    return {
      ...startNode,
      tree: nextTree
    };
  } else {
    // find in each node
    return {
      ...startNode,
      tree: startNode.tree.map(node => appendTreeNode(node, sha, tree))
    };
  }
}

export function mutatePathIn(obj, path, node) {
  path.split('/').reduce((o, path, i, paths) => {
    const isLast = paths.length === i + 1;
    if (isLast) {
      o[path] = {
        ...node,
        path,
        [FILE]: true
      };
    } else if (!o.hasOwnProperty(path)) {
      o[path] = {};
    }
    return o[path];
  }, obj);
  return obj;
}

export function collapseToTree(obj) {
  const tree = Object.entries(obj).map(([path, node]) => {
    if (node[FILE]) {
      delete node[FILE];
      return {
        ...node,
        type: 'blob',
        path
      };
    }

    const paths = [path];
    let start = node;
    while (Object.keys(start).length === 1) {
      const key = Object.keys(start)[0];
      if (start[key][FILE]) {
        break;
      }

      paths.push(key);
      start = start[key];
    }

    return {
      type: 'tree',
      path: paths.join('/'),
      tree: collapseToTree(start)
    };
  });
  return tree;
}
