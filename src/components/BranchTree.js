import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Tree from './Tree';
import { Renderer } from './WithRenderer';
import usePartialTree from './hooks/usePartialTree';

const BranchTree = props => {
  const [state, expandTree] = usePartialTree(props.head);
  const { BlobNode } = useContext(Renderer);

  const onExpandTree = sha => {
    props.onLoadTree(sha).then(tree => expandTree(sha, tree));
  }

  useEffect(() => {
    onExpandTree(props.head);
  }, []);

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
  head: PropTypes.string.isRequired,
  onLoadTree: PropTypes.func.isRequired
};

export default BranchTree;
