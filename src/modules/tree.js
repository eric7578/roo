import { treeNodeTypes } from '../enum';

const TOGGLE = 'tree/TOGGLE';
const APPEND = 'tree/APPEND';
const COMPRESS = 'tree/COMPRESS';

export function sourceTreeNodeAction(node) {
  return async dispatch => {
    if (node.type === treeNodeTypes.FILE) {
      // TODO
      return;
    }

    // tree node
    dispatch(toggleNode(node.fullPath));
    if (!node.tree) {
      await dispatch(getSourceTreeNodes(node));
    }
  };
}

export function getSourceTreeNodes(parentNode) {
  return async (dispatch, getState, { dataSource }) => {
    const state = getState();
    if (parentNode) {
      const nodes = await dataSource.getNodes(state.vars.params, parentNode);
      dispatch(appendNodes(nodes, parentNode));
    } else {
      const nodes = await dataSource.getNodes(state.vars.params);
      dispatch(appendNodes(nodes));
    }
  };
}

export function toggleNode(fullPath, isOpen) {
  return {
    type: TOGGLE,
    fullPath,
    isOpen
  };
}

export function appendNodes(nodes, parentNode) {
  return {
    type: APPEND,
    parentNode,
    nodes
  };
}

export function compressTree() {
  return {
    type: COMPRESS
  };
}

export default function reducer(state = new Map(), action) {
  switch (action.type) {
    case TOGGLE:
      return toggle(state, action);
    case APPEND:
      if (action.parentNode) {
        return appendTo(state, action.parentNode, action.nodes);
      }
      return action.nodes.reduce((state, node) => {
        if (node.fullPath) {
          return append(state, node.fullPath, node);
        }
        throw new Error(
          `need to provide either parent node's fullPath or the node's fullPath when insert nodes`
        );
      }, state);
    case COMPRESS:
      return compress(state);
    default:
      return state;
  }
}

function toggle(state, action) {
  const node = state.get(action.fullPath);

  if (!node) {
    return state;
  }

  return new Map(state).set(action.fullPath, {
    ...node,
    isOpen: action.isOpen !== undefined ? action.isOpen : !node.isOpen
  });
}

function append(state, fullPath, node) {
  return fullPath.split('/').reduce((nextState, path, index, pathSegs) => {
    const nodePath = pathSegs.slice(0, index + 1).join('/');
    const hasParent = index > 0;
    const isLastRun = index === pathSegs.length - 1;

    if (hasParent) {
      const parentPath = pathSegs.slice(0, index).join('/');
      const parentNode = nextState.get(parentPath);
      nextState.set(parentPath, {
        ...parentNode,
        tree: new Set(parentNode.tree).add(nodePath)
      });
    }

    if (isLastRun) {
      return nextState.set(nodePath, {
        ...node,
        fullPath: nodePath,
        path
      });
    }

    return nextState.set(nodePath, {
      fullPath: nodePath,
      path,
      type: treeNodeTypes.TREE
    });
  }, new Map(state));
}

function appendTo(state, parentNode, nodes) {
  const nextState = new Map(state);
  const parentNodeTree = new Set(parentNode.tree);
  for (const node of nodes) {
    const nodePath = `${parentNode.fullPath}/${node.path}`;
    parentNodeTree.add(nodePath);
    nextState.set(nodePath, {
      ...node,
      fullPath: nodePath
    });
  }
  return nextState.set(parentNode.fullPath, {
    ...nextState.get(parentNode.fullPath),
    tree: parentNodeTree
  });
}

function compress(state) {
  const compressedAbsPaths = new Set();
  return Array.from(state.entries()).reduce((newState, [absPath, node]) => {
    if (node.type === treeNodeTypes.FILE || node.tree.size > 1) {
      return newState.set(absPath, node);
    } else if (node.tree.size === 0 || compressedAbsPaths.has(absPath)) {
      return newState;
    }

    while (node.type === treeNodeTypes.TREE && node.tree.size === 1) {
      const subNodeAbsPath = node.tree.values().next().value;
      const subNode = state.get(subNodeAbsPath);
      if (subNode.type === treeNodeTypes.FILE) {
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
