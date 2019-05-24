import React, {useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import {Renderer, Repository} from '../context';
import Tree from './Tree';
import useTree from '../hooks/useTree';

const Commit = props => {
  const {CommitNode} = useContext(Renderer);
  const {repo} = useContext(Repository);
  const [flattenTree, setFlattenTree] = useState([]);
  const {state} = useTree(flattenTree);

  useEffect(() => {
    repo.getCommit(props.commit).then(setFlattenTree);
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
