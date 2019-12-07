import React, { useMemo, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import ResizeBar from './ResizeBar';
import { Key, Search, Settings, Documents } from '../icons';
import { tabTypes } from '../../enum';

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

const Tabs = ({ tab, toolBarOnly, tabs, onClick }) => {
  return tabs.map((tabType, index) => (
    <Icon
      key={index}
      selected={!toolBarOnly && tab === tabType.type}
      onClick={e => onClick(tabType.type)}
    >
      {tabType.icon}
    </Icon>
  ));
};

const Explorer = ({
  toolBarOnly,
  tab,
  onChangeTab,
  maxExplorerWidth,
  explorerWidth,
  onChangeExplorerWidth,
  children
}) => {
  const tabs = useMemo(
    () => [
      { type: tabTypes.TREE, icon: <Documents /> },
      { type: tabTypes.SEARCH, icon: <Search /> },
      { type: tabTypes.CREDENTIALS, icon: <Key /> },
      { type: tabTypes.SETTINGS, icon: <Settings /> }
    ],
    []
  );
  const [offsetWidth, setOffsetWidth] = useState(explorerWidth);
  useEffect(() => {
    setOffsetWidth(offsetWidth);
  }, [explorerWidth]);

  const onResizing = useCallback(
    width => {
      setOffsetWidth(Math.max(maxExplorerWidth, width));
    },
    [maxExplorerWidth]
  );

  const onResizeEnd = useCallback(
    width => {
      onChangeExplorerWidth(Math.max(maxExplorerWidth, width));
    },
    [maxExplorerWidth, onChangeExplorerWidth]
  );

  return (
    <>
      <Wrapper>
        <ActivityBar>
          <IconList>
            <Tabs
              tab={tab}
              tabs={tabs}
              toolBarOnly={toolBarOnly}
              onClick={onChangeTab}
            />
          </IconList>
        </ActivityBar>
        {!toolBarOnly && (
          <ContentWrapper style={{ width: offsetWidth }}>
            <SideWrapper>{children}</SideWrapper>
            <ResizeBar onDrag={onResizing} onStop={onResizeEnd} />
          </ContentWrapper>
        )}
      </Wrapper>
      <BodyOffset offset={offsetWidth + 70} />
    </>
  );
};

Explorer.propTypes = {
  toolBarOnly: PropTypes.bool,
  tab: PropTypes.symbol,
  onChangeTab: PropTypes.func,
  maxExplorerWidth: PropTypes.number,
  explorerWidth: PropTypes.number,
  onChangeExplorerWidth: PropTypes.func
};

Explorer.defaultProps = {
  maxExplorerWidth: 200
};

export default Explorer;
