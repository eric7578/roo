import { useReducer, useEffect } from 'react';


function reducer(state, action) {
  switch (action.type) {
    case 'checkoutHead':
      return checkoutHead(action.head);
    case 'expandTree':
      return expandTree(state, action);
    default:
      return state;
  }
}

function checkoutHead(head) {
  return {
    sha: head,
    type: 'tree'
  };
}

function expandTree(state, action) {
  action.tree.sort(sortNodes);
  return appendTreeNode(state, action.sha, action.tree);
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

export default function usePartialTree(head) {
  const [state, dispatch] = useReducer(reducer, head, checkoutHead);

  useEffect(() => {
    dispatch({
      type: 'checkoutHead',
      head
    });
  }, [head]);

  return [
    state,
    (sha, tree) => dispatch({
      type: 'expandTree',
      sha,
      tree
    })
  ];
}
