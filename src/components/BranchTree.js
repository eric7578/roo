import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Tree from './Tree';
import { Renderer } from './WithRenderer';
import useTree, { ROOT_SHA } from './hooks/useTree';

const BranchTree = props => {
  const { state, expandTree, resetTree } = useTree();
  const { BlobNode } = useContext(Renderer);

  const onExpandTree = sha => {
    props.onLoadTree(sha).then(tree => expandTree(sha, tree));
  }

  useEffect(() => {
    resetTree();
    props.onLoadTree(props.branch).then(tree => expandTree(ROOT_SHA, tree));
  }, [props.branch]);

  return (
    <Tree
      {...state}
      root
      type='tree'
      blobNodeComponent={BlobNode}
      onExpandTree={onExpandTree}
    />
  );
}

BranchTree.propTypes = {
  branch: PropTypes.string.isRequired,
  onLoadTree: PropTypes.func.isRequired
};

export default BranchTree;
