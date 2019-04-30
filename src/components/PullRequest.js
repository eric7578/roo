import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tree from './Tree';
import useFlattenTree from '../components/hooks/useFlattenTree';

const JSONRenderer = props => {
  return (
    <div>
      {props.tree.path}
      <div>{props.patch}</div>
    </div>
  );
}

const PullRequest = props => {
  const [items, setItems] = useState([]);
  const state = useFlattenTree(items);

  useEffect(() => {
    props.onGetPR().then(setItems);
  }, []);

  return items.length > 0 && (
    <Tree
      {...state}
      root
      type='tree'
      blobNodeComponent={JSONRenderer}
    />
  );
}

PullRequest.propTypes = {
  onGetPR: PropTypes.func
};

export default PullRequest;