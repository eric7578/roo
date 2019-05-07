import React, {useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import {Renderer} from './WithRenderer';
import {Repository} from './WithRepository';
import Tree from './Tree';
import useTree from '../components/hooks/useTree';

const PullRequest = props => {
  const {PRBlobNode} = useContext(Renderer);
  const {repo} = useContext(Repository);
  const [flattenTree, setFlattenTree] = useState([]);
  const {state} = useTree(flattenTree);

  useEffect(() => {
    repo.getPullRequest(props.pr).then(setFlattenTree);
  }, [props.pr]);

  return flattenTree.length > 0 && (
    <Tree
      {...state}
      root
      type='tree'
      blobNodeComponent={PRBlobNode}
    />
  );
}

PullRequest.propTypes = {
  pr: PropTypes.string.isRequired
};

export default PullRequest;
