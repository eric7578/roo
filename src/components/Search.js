import React, {useState, useContext} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Tree from './Tree';
import {DataSource} from '../context';
import {UnknownFile, Text} from './icons';
import useTree from '../hooks/useTree';
import useDelay from '../hooks/useDelay';
import HeadNode from './nodes/HeadNode';

const SearchWrapper = styled.div`
  align-items: center;
  background-color: #3c3c3c;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  padding: 3px;
`;

const Input = styled.input.attrs({type: 'text'})`
  background: none;
  border: none;
  color: #fafafa;
  outline: none;
  padding-left: 5px;
  width: 100%;
`;

const SearchCondition = styled.label`
  cursor: pointer;

  input {
    display: none;
  }

  input:checked + svg {
    fill: #fafafa;
  }

  svg {
    display: block;
    fill: #616161;
    height: 16px;
    transition: .2s;
    width: 18px;
  }
`;

const Search = props => {
  const {searchFile, searchCode} = useContext(DataSource);
  const [flattenTree, setFlattenTree] = useState([]);
  const {state} = useTree(flattenTree);
  const [searchType, setSearchType] = useState('filename');

  const onChangeSearchType = e => {
    setSearchType(e.target.value);
  }

  const onSubmitSearch = searchText => {
    if (searchText) {
      if (searchType === 'filename') {
        searchFile(searchText).then(setFlattenTree);
      } else {
        searchCode(searchText).then(setFlattenTree);
      }
    }
  }

  const delay = useDelay(onSubmitSearch, props.delay);

  return (
    <div>
      <SearchWrapper>
        <Input
          onKeyUp={e => {
            const searchText = e.target.value.trim();
            if (e.keyCode === 13) {
              onSubmitSearch(searchText);
            } else {
              delay(searchText);
            }
          }}
        />
        <SearchCondition>
          <input
            type='radio'
            value='filename'
            checked={searchType === 'filename'}
            onChange={onChangeSearchType}
          />
          <UnknownFile />
        </SearchCondition>
        <SearchCondition>
          <input
            type='radio'
            value='code'
            checked={searchType === 'code'}
            onChange={onChangeSearchType}
          />
          <Text />
        </SearchCondition>
      </SearchWrapper>
      {flattenTree.length > 0 &&
        <Tree
          tree={state.tree}
          blobNodeComponent={HeadNode}
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
