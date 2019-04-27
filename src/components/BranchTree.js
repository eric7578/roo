import React, { useReducer, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Tree from './Tree';
import { Renderer } from './WithRenderer';

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

const BranchTree = props => {
  const [state, dispatch] = useReducer(reducer, props.head, checkoutHead);
  const { BlobNode } = useContext(Renderer);

  const onExpandTree = sha => {
    props.onLoadTree(sha).then(tree => {
      dispatch({
        type: 'expandTree',
        sha,
        tree
      });
    });
  }

  useEffect(() => {
    onExpandTree(props.head);
  }, []);

  useEffect(() => {
    dispatch({
      type: 'checkoutHead',
      head: props.head
    });
  }, [props.head]);

  return (
    <Tree
      root
      type='tree'
      sha={state.sha}
      tree={state.tree}
      blobNodeComponent={BlobNode}
      onExpandTree={onExpandTree}
    />
  );
}

BranchTree.propTypes = {
  head: PropTypes.string.isRequired,
  onLoadTree: PropTypes.func.isRequired
};

export default BranchTree;
