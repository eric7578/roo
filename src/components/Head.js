import React, {useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import Tree from './Tree';
import {Renderer} from './WithRenderer';
import {Repository} from './WithRepository';
import useTree, {ROOT_SHA} from './hooks/useTree';

const Head = props => {
  const {state, expandTree, resetTree} = useTree();
  const {BlobNode} = useContext(Renderer);
  const {repo} = useContext(Repository);

  const onExpandTree = sha => {
    repo.getNodes(sha).then(tree => expandTree(sha, tree));
  }

  useEffect(() => {
    resetTree();
    repo.getNodes(props.head).then(tree => expandTree(ROOT_SHA, tree));
  }, [props.head]);

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

Head.propTypes = {
  head: PropTypes.string.isRequired
};

export default Head;
