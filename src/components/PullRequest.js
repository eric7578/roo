import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Renderer } from './WithRenderer';
import Tree from './Tree';
import useTree from '../components/hooks/useTree';

const PullRequest = props => {
  const { PRBlobNode } = useContext(Renderer);
  const [items, setItems] = useState([]);
  const { state } = useTree(items);

  useEffect(() => {
    props.onGetPR().then(setItems);
  }, []);

  return items.length > 0 && (
    <Tree
      {...state}
      root
      type='tree'
      blobNodeComponent={PRBlobNode}
    />
  );
}

PullRequest.propTypes = {
  onGetPR: PropTypes.func
};

export default PullRequest;
