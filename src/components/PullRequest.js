import React, {useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import {Renderer} from './WithRenderer';
import {Repository} from './WithRepository';
import Tree from './Tree';
import useTree from '../components/hooks/useTree';

const PullRequest = props => {
  const {PrNode} = useContext(Renderer);
  const {repo} = useContext(Repository);
  const [flattenTree, setFlattenTree] = useState([]);
  const {state} = useTree(flattenTree);

  useEffect(() => {
    repo.getPullRequest(props.pr).then(setFlattenTree);
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
