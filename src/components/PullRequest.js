import React, {useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import {DataSource} from '../context';
import Tree from './Tree';
import PrNode from './nodes/PrNode';
import useTree from '../hooks/useTree';

const PullRequest = props => {
  const {getPullRequest} = useContext(DataSource);
  const [flattenTree, setFlattenTree] = useState([]);
  const {state} = useTree(flattenTree);

  useEffect(() => {
    getPullRequest(props.pr).then(setFlattenTree);
  }, [props.pr]);

  return flattenTree.length > 0 && (
    <Tree
      tree={state.tree}
      blobNodeComponent={PrNode}
    />
  );
}

PullRequest.propTypes = {
  pr: PropTypes.string.isRequired
};

export default PullRequest;
