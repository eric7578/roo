import { createSelector } from 'reselect';
import { treeNodeTypes } from '../../enum';

export function treeNodesSelectorCreator() {
  return createSelector(
    state => state.tree,
    (_, nodeTree) => nodeTree,
    (tree, nodeTree) => {
      if (!nodeTree) {
        return [];
      }
      return Array.from(nodeTree)
        .map(fullPath => tree.get(fullPath))
        .sort(sortNodes);
    }
  );
}

export function rootNodesSelctorCreator() {
  return createSelector(
    state => state.tree,
    tree => {
      return Array.from(tree.entries())
        .reduce((rootNodes, [fullPath, node]) => {
          if (fullPath === node.path) {
            rootNodes.push(node);
          }
          return rootNodes;
        }, [])
        .sort(sortNodes);
    }
  );
}

function sortNodes(n1, n2) {
  if (n1.type !== n2.type) {
    return n1.type === treeNodeTypes.TREE ? -1 : 1;
  }
  if (n1.path <= n2.path) {
    return -1;
  } else {
    return 1;
  }
}

export function nextPrefetchNodeSelectorCreator() {
  return createSelector(
    state => state.vars.params.fullPath,
    state => state.tree,
    (fullPath, tree) => {
      if (!fullPath) {
        return null;
      }
      const fullPathSegs = fullPath.split('/');
      for (let segIndex = 0; segIndex < fullPathSegs.length; segIndex++) {
        const pathSeg = fullPathSegs.slice(0, segIndex + 1).join('/');
        const parentNode = tree.get(pathSeg);
        if (
          parentNode &&
          parentNode.type === treeNodeTypes.TREE &&
          !parentNode.tree
        ) {
          return parentNode;
        }
      }
    }
  );
}
