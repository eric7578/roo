import React, {useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import {Renderer} from './WithRenderer';
import {Repository} from './WithRepository';
import Tree from './Tree';
import useTree from '../components/hooks/useTree';

const Commit = props => {
  const {CommitBlobNode} = useContext(Renderer);
  const {repo} = useContext(Repository);
  const [flattenTree, setFlattenTree] = useState([]);
  const {state} = useTree(flattenTree);

  useEffect(() => {
    repo.getCommit(props.commit).then(setFlattenTree);
  }, [props.commit]);

  return flattenTree.length > 0 && (
    <Tree
      {...state}
      root
      type='tree'
      blobNodeComponent={CommitBlobNode}
    />
  );
}

Commit.propTypes = {
  commit: PropTypes.string.isRequired
};

export default Commit;
