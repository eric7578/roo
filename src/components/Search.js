import React, { useState, useContext, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Tree from './Tree';
import { UnknownFile, Text } from './icons';
import { Context as BackendContext } from './Backend';
import useTree from '../hooks/useTree';
import useDebounceCallback from '../hooks/useDebounceCallback';
import { Input } from './Form';

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
    transition: 0.2s;
    width: 18px;
  }
`;

const SearchInfo = styled.p`
  color: #7d7d7e;
  margin: 10px 0;
`;

export default function Search({ searchDelay }) {
  const { params, search } = useContext(BackendContext);
  const [tree, { buildTree, updateNode }] = useTree();
  const [searchData, setSearchData] = useState({
    keyword: '',
    type: 'filename'
  });

  const onChangeSearchType = useCallback(e => {
    setSearchData(searchData => ({
      ...searchData,
      type: e.target.value
    }));
  }, []);

  const onChangeSearch = useDebounceCallback(e => {
    setSearchData(searchData => ({
      ...searchData,
      keyword: e.target.value.trim()
    }));
  }, searchDelay);

  const onExpand = useCallback(node => {
    updateNode(node.path, { open: !node.open });
  }, []);

  useEffect(() => {
    if (searchData.keyword) {
      search(params, searchData).then(nodes =>
        buildTree(nodes, {
          open: true
        })
      );
    }
  }, [searchData, params]);

  const numFounded = Object.keys(tree).length;
  return (
    <>
      <SearchWrapper>
        <Input
          placeholder={
            searchData.type === 'filename'
              ? 'Search by path'
              : 'Search by content'
          }
          defaultValue={searchData.keyword}
          onChange={onChangeSearch}
        />
        <SearchCondition>
          <input
            type='radio'
            value='filename'
            checked={searchData.type === 'filename'}
            onChange={onChangeSearchType}
          />
          <UnknownFile />
        </SearchCondition>
        <SearchCondition>
          <input
            type='radio'
            value='code'
            checked={searchData.type === 'code'}
            onChange={onChangeSearchType}
          />
          <Text />
        </SearchCondition>
      </SearchWrapper>
      {searchData.keyword && (
        <>
          <SearchInfo>
            {numFounded ? `${numFounded} results.` : `No results found.`}
          </SearchInfo>
          {numFounded > 0 && <Tree tree={tree} onExpand={onExpand} />}
        </>
      )}
    </>
  );
}

Search.propTypes = {
  searchDelay: PropTypes.number
};

Search.defaultProps = {
  searchDelay: 300
};
