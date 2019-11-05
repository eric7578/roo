import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import ResizeBar from './ResizeBar';
import useStorage from '../../hooks/useStorage';
import { Key, Search, Settings, Documents } from '../icons';
import * as TabTypes from '../../types/TabTypes';

const Wrapper = styled.div`
  background-color: #21242a;
  display: flex;
  height: 100vh;
  left: 0;
  position: fixed;
  top: 0;
  z-index: 1000;
`;

const ContentWrapper = styled.div`
  display: flex;
  height: 100vh;
  overflow: auto;
`;

const BodyOffset = createGlobalStyle`
  body {
    margin-left: ${props => props.offset}px;
  }
`;

const ActivityBar = styled.div`
  align-items: center;
  background-color: #16181d;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 18px 0;
  width: 70px;
`;

const IconList = styled.ul`
  display: flex;
  flex: 1;
  flex-direction: column;
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const Icon = styled.li`
  align-items: center;
  background-color: ${props => (props.selected ? '#484f63' : '#242730')};
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  height: 40px;
  justify-content: center;
  list-style-type: none;
  transition: 0.5s;
  width: 40px;

  &:not(:last-child) {
    margin-bottom: 15px;
  }

  svg {
    fill: ${props => (props.selected ? '#a7c6d6' : '#78909c')};
    transition: 0.2s;
  }

  &:last-child {
    margin-top: auto;
  }
`;

const SideWrapper = styled.div`
  flex: 1;
`;

const Explorer = ({ minResizeWidth, children, tab, onChangeTab }) => {
  const { preferences } = useStorage();
  const [contentWidth, setContentWidth] = useState(preferences.contentWidth);
  const [showSideContent, setShowSideContent] = useState(true);

  const onClickIcon = useCallback(
    nextTab => {
      if (nextTab === tab) {
        setShowSideContent(!showSideContent);
      } else {
        setShowSideContent(true);
        onChangeTab(nextTab);
      }
    },
    [showSideContent, tab, onChangeTab]
  );

  return (
    <>
      <Wrapper>
        <ActivityBar>
          <IconList>
            <Icon
              selected={showSideContent && tab === TabTypes.SOURCE}
              onClick={e => onClickIcon(TabTypes.SOURCE)}
            >
              <Documents />
            </Icon>
            <Icon
              selected={showSideContent && tab === TabTypes.SEARCH}
              onClick={e => onClickIcon(TabTypes.SEARCH)}
            >
              <Search />
            </Icon>
            <Icon
              selected={showSideContent && tab === TabTypes.CREDENTIALS}
              onClick={e => onClickIcon(TabTypes.CREDENTIALS)}
            >
              <Key />
            </Icon>
            <Icon
              selected={showSideContent && tab === TabTypes.SETTINGS}
              onClick={e => onClickIcon(TabTypes.SETTINGS)}
            >
              <Settings />
            </Icon>
          </IconList>
        </ActivityBar>
        {showSideContent && (
          <ContentWrapper
            style={{
              width: contentWidth,
              minWidth: minResizeWidth
            }}
          >
            <SideWrapper>{children}</SideWrapper>
            <ResizeBar onDrag={setContentWidth} onStop={() => {}} />
          </ContentWrapper>
        )}
      </Wrapper>
      <BodyOffset offset={contentWidth} />
    </>
  );
};

Explorer.propTypes = {
  minResizeWidth: PropTypes.number,
  tab: PropTypes.symbol,
  onChangeTab: PropTypes.func
};

Explorer.defaultProps = {
  minResizeWidth: 300
};

export default Explorer;
