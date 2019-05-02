import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Tree from './Tree';
import { Renderer } from './WithRenderer';
import useTree from '../components/hooks/useTree';

const Search = props => {
  const { BlobNode } = useContext(Renderer);
  const [items, setItems] = useState([]);
  const { state } = useTree(items);

  const onKeyPress = e => {
    if (e.key === 'Enter') {
      props.onSearch(e.target.value.trim()).then(setItems);
    }
  }

  return (
    <div>
      <input type='text' onKeyPress={onKeyPress} />
      {items.length > 0 &&
        <Tree
          {...state}
          root
          type='tree'
          blobNodeComponent={BlobNode}
        />
      }
    </div>
  );
}

Search.propTypes = {
  onSearch: PropTypes.func
};

export default Search;