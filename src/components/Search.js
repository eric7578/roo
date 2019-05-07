import React, {useState, useContext} from 'react';
import PropTypes from 'prop-types';
import Tree from './Tree';
import {Renderer} from './WithRenderer';
import {Repository} from './WithRepository';
import useTree from '../components/hooks/useTree';
import useDelay from './hooks/useDelay';

const Search = props => {
  const {BlobNode} = useContext(Renderer);
  const {repo} = useContext(Repository);
  const [flattenTree, setFlattenTree] = useState([]);
  const {state} = useTree(flattenTree);

  const submitSearch = searchText => {
    if (searchText) {
      repo.searchPath(searchText).then(setFlattenTree);
    }
  }

  const delay = useDelay(submitSearch, props.delay);

  return (
    <div>
      <input
        type='text'
        onKeyUp={e => {
          const searchText = e.target.value.trim();
          if (e.keyCode === 13) {
            submitSearch(searchText);
          } else {
            delay(searchText);
          }
        }}
      />
      {flattenTree.length > 0 &&
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
  delay: PropTypes.number
};

Search.defaultProps = {
  delay: 300
};

export default Search;
