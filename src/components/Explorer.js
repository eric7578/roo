import React, { useRef, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import useMouseDragging from '../hooks/useMouseDragging';
import useStorage from '../hooks/useStorage';
import { Key, Search, Settings } from './icons';

const Wrapper = styled.div`
  background-color: #21242a;
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

const ResizeDetect = styled.div`
  cursor: col-resize;
  height: 100vh;
  position: absolute;
  top: 0;
  right: 0;
  width: 3px;
`;

const ToggleButton = styled.input.attrs({ type: 'button' })`
  position: fixed;
  left: 0;
  top: 0;
  width: 50px;
  height: 50px;
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
  min-width: 70px;
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

const Explorer = props => {
  const { preferences, setPreferences } = useStorage();
  const [contentWidth, setContentWidth] = useState(preferences.contentWidth);
  const [isHidden, setIsHidden] = useState(
    preferences.contentWidth < props.minResizeWidth
  );
  const resizeRef = useRef();
  const contentRef = useRef();

  useEffect(() => {
    if (!isHidden) {
      const { width } = contentRef.current.getBoundingClientRect();
      setContentWidth(width);
    }
  }, []);

  useMouseDragging(
    {
      onDrag(e) {
        const nextIsHidden = e.clientX < props.minResizeWidth;
        setIsHidden(nextIsHidden);
        if (!nextIsHidden) {
          setContentWidth(e.clientX);
        }
      },
      onStop(e) {
        setPreferences('contentWidth', e.clientX);
      }
    },
    resizeRef,
    10
  );

  return (
    <Wrapper>
      {isHidden && (
        <ToggleButton value="Open" onClick={e => setIsHidden(false)} />
      )}
      {!isHidden && (
        <ContentWrapper
          ref={contentRef}
          style={{
            width: contentWidth,
            minWidth: isHidden ? undefined : props.minResizeWidth
          }}
        >
          <ActivityBar>
            <IconList>
              <Icon
                selected={props.selected === 'search'}
                onClick={e => props.onChange('search')}
              >
                <Search />
              </Icon>
              <Icon
                selected={props.selected === 'auth'}
                onClick={e => props.onChange('auth')}
              >
                <Key />
              </Icon>
              <Icon
                selected={props.selected === 'settings'}
                onClick={e => props.onChange('settings')}
              >
                <Settings />
              </Icon>
            </IconList>
          </ActivityBar>
          <SideWrapper>{props.children}</SideWrapper>
        </ContentWrapper>
      )}
      <BodyOffset offset={isHidden ? 0 : contentWidth} />
      <ResizeDetect ref={resizeRef} />
    </Wrapper>
  );
};

Explorer.propTypes = {
  minResizeWidth: PropTypes.number,
  children: PropTypes.node,
  onChange: PropTypes.func.isRequired
};

Explorer.defaultProps = {
  minResizeWidth: 300
};

export default Explorer;
