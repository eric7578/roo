import React, {useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import Tree from './Tree';
import {DataSource} from '../context';
import useTree, {ROOT_SHA} from '../hooks/useTree';
import HeadNode from './nodes/HeadNode';

const Head = props => {
  const {state, expandTree, resetTree} = useTree();
  const {getNodes, filepath} = useContext(DataSource);

  useEffect(() => {
    resetTree();
    getNodes(props.head).then(tree => expandTree(ROOT_SHA, tree));
  }, [props.head]);

  return (
    <Tree
      tree={state.tree}
      defaultOpen={filepath && filepath.split('/')}
      blobNodeComponent={HeadNode}
      onExpand={sha => {
        getNodes(sha).then(tree => expandTree(sha, tree));
      }}
    />
  );
}

Head.propTypes = {
  head: PropTypes.string.isRequired
};

export default Head;
