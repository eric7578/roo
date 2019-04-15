import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Search = props => {
  const [items, setItems] = useState([]);

  const onKeyPress = e => {
    if (e.key === 'Enter') {
      props.onSearch(e.target.value.trim()).then(setItems);
    }
  }

  return (
    <div>
      <input type='text' onKeyPress={onKeyPress} />
      {items.length > 0 &&
        <ol>
          {items.map(item =>
            <li key={item.sha}>
              {item.name}
              {item.path}
            </li>
          )}
        </ol>
      }
    </div>
  );
}

Search.propTypes = {
  onSearch: PropTypes.func
};

export default Search;