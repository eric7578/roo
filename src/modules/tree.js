import { treeNodeTypes, treeTypes } from '../enum';

const TOGGLE = 'tree/TOGGLE';
const LOAD_TREE = 'tree/LOAD_TREE';
const APPEND = 'tree/APPEND';
const COMPRESS = 'tree/COMPRESS';
const OPEN_FULLPATH = 'tree/OPEN_FULLPATH';

export function toggleNode(treeType, fullPath) {
  return {
    type: TOGGLE,
    treeType,
    fullPath
  };
}

export function navigateNode(treeType, fullPath) {
  return (dispatch, getState, { dataSource }) => {
    const state = getState();
    const node = state.tree.get(treeType).get(fullPath);
    dataSource.navigateNode(state.vars.params, node);
  };
}

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

export function getSourceTreeNodes() {
  return async (dispatch, getState, { dataSource }) => {
    const state = getState();

    // load source tree
    const tree = state.tree.get(treeTypes.TREE);
    if (tree.size === 0) {
      const nodes = await dataSource.getSourceTreeNodes(state.vars.params);
      dispatch({
        type: LOAD_TREE,
        treeType: treeTypes.TREE,
        nodes
      });
    }

    // open default path
    dispatch({
      type: OPEN_FULLPATH,
      treeType: treeTypes.TREE,
      fullPath: state.vars.params.fullPath
    });
  };
}

export function appendNodes(nodes, parentNode) {
  return {
    type: APPEND,
    parentNode,
    nodes
  };
}

export default function reducer(
  state = new Map([
    [treeTypes.TREE, new Map()],
    [treeTypes.SEARCH, new Map()]
  ]),
  action
) {
  switch (action.type) {
    case LOAD_TREE:
      let tree = createTree(action.nodes);
      if (action.compress) {
        tree = compressTree(tree);
      }
      return new Map(state).set(action.treeType, tree);
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
    case OPEN_FULLPATH:
      return openFullPath(state, action);
    default:
      return state;
  }
}

function createTree(nodes) {
  return nodes.reduce((tree, node) => {
    const pathSegs = node.fullPath.split('/').filter(path => path !== '');
    pathSegs.forEach((path, index) => {
      const fullPath = pathSegs.slice(0, index + 1).join('/');
      const isRoot = path === fullPath;
      const parent = pathSegs.slice(0, index).join('/');

      // create node if not exist
      if (!tree.has(fullPath)) {
        // new node
        tree.set(fullPath, {
          ...node,
          isRoot,
          fullPath,
          path,
          isOpen: false,
          parent,
          tree: new Set()
        });
      }

      if (!isRoot) {
        const parentNode = tree.get(parent);
        parentNode.tree.add(fullPath);
      }
    });
    return tree;
  }, new Map());
}

function compressTree(tree) {
  Array.from(tree.entries()).forEach(([fullPath, node]) => {
    if (node.tree && node.tree.size === 1) {
      node.tree.forEach(childFullPath => {
        const childNode = tree.get(childFullPath);
        childNode.path = `${fullPath}/${childNode.path}`;
      });
      tree.delete(fullPath);
    }
  });
  return tree;
}

function toggle(state, action) {
  const tree = state.get(action.treeType);
  const node = tree.get(action.fullPath);
  const nextTree = new Map(tree).set(action.fullPath, {
    ...node,
    isOpen: !node.isOpen
  });
  return new Map(state).set(action.treeType, nextTree);
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

function openFullPath(state, action) {
  const nextTree = new Map(state.get(action.treeType));
  let node = nextTree.get(action.fullPath);

  do {
    nextTree.set(node.fullPath, {
      ...node,
      isOpen: true
    });

    node = nextTree.get(node.parent);
  } while (node);

  return new Map(state).set(action.treeType, nextTree);
}
