import React, {useState, useContext, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Tree from './Tree';
import {DataSource} from '../context';
import {UnknownFile, Text} from './icons';
import useTree from '../hooks/useTree';
import NavigateNode from './nodes/NavigateNode';
import {Input} from './Form';

const Wrapper = styled.div`
  padding: 18px;
`;

const SearchWrapper = styled.div`
  align-items: center;
  background-color: #3c3c3c;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  padding: 3px;
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

const SearchInfo = styled.p`
  color: #7d7d7e;
  margin: 10px 0;
`;

const Search = props => {
  const {searchFile, searchCode} = useContext(DataSource);
  const [flattenTree, setFlattenTree] = useState();
  const [searchText, setSearchText] = useState('');
  const {state} = useTree(flattenTree);
  const [searchType, setSearchType] = useState('filename');

  const onSubmitSearch = () => {
    if (searchText) {
      if (searchType === 'filename') {
        searchFile(searchText).then(setFlattenTree);
      } else {
        searchCode(searchText).then(setFlattenTree);
      }
    }
  }

  const onChangeSearchType = e => {
    setSearchType(e.target.value);
  }

  useEffect(() => {
    if (searchText) {
      onSubmitSearch();
    }
  }, [searchType]);

  const onChangeSearch = e => {
    setSearchText(e.target.value.trim());
  }

  return (
    <Wrapper>
      <SearchWrapper>
        <Input
          placeholder={searchType === 'filename' ? 'Search by path' : 'Search by content'}
          value={searchText}
          onChange={onChangeSearch}
          onKeyUp={e => {
            if (e.keyCode === 13) {
              onSubmitSearch();
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
      {flattenTree && flattenTree.length === 0 &&
        <SearchInfo>No results found.</SearchInfo>
      }
      {flattenTree && flattenTree.length > 0 &&
        <>
          <SearchInfo>{`${flattenTree.length} results.`}</SearchInfo>
          <Tree
            tree={state.tree}
            blobNodeComponent={NavigateNode}
          />
        </>
      }
    </Wrapper>
  );
}

Search.propTypes = {
  delay: PropTypes.number
};

Search.defaultProps = {
  delay: 300
};

export default Search;
