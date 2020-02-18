import { createSelector } from 'reselect';
import { treeNodeTypes, treeTypes } from '../../enum';

export function createRootNodesSelctor(treeType) {
  return createSelector(
    state => state.tree.get(treeType),
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

export function createTreeNodesSelector(treeType) {
  return createSelector(
    state => state.tree.get(treeType),
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

function sortNodes(n1, n2) {
  if (n1.isFile !== n2.isFile) {
    return n1.isFile ? 1 : -1;
  }
  if (n1.path <= n2.path) {
    return -1;
  } else {
    return 1;
  }
}
