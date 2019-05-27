import React, {useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import {DataSource} from '../context';
import Tree from './Tree';
import useTree from '../hooks/useTree';
import CommitNode from './nodes/CommitNode';

const Commit = props => {
  const {getCommit} = useContext(DataSource);
  const [flattenTree, setFlattenTree] = useState([]);
  const {state} = useTree(flattenTree);

  useEffect(() => {
    getCommit(props.commit).then(setFlattenTree);
  }, [props.commit]);

  return flattenTree.length > 0 && (
    <Tree
      tree={state.tree}
      blobNodeComponent={CommitNode}
    />
  );
}

Commit.propTypes = {
  commit: PropTypes.string.isRequired
};

export default Commit;
