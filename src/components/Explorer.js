import React, { memo, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { css, ThemeProvider, createGlobalStyle } from 'styled-components';
import useDetectedTheme from './hooks/useDetectedTheme';
import useMouseDragging from './hooks/useMouseDragging';

const Wrapper = styled.div`
  background-color: ${props => props.theme.backgroundColor};
  color: ${props => props.theme.color};
  height: 100vh;
  left: 0;
  overflow: auto;
  position: fixed;
  top: 0;
`;

const BodyStyle = memo(createGlobalStyle`
  body {
    margin-left: ${props => props.offsetLeft}px;
  }
`);

const ContentWrapper = memo(styled.div`
  height: 100vh;
  overflow: auto;
  width: ${props => props.contentWidth}px;
  ${props => !props.isHidden && css`min-width: ${props => props.minWidth}px;`}
`);

const ResizeDetect = styled.div`
  cursor: col-resize;
  height: 100vh;
  position: absolute;
  top: 0;
  right: 0;
  width: 3px;
`;

const ToggleButton = styled.input.attrs({
  type: 'button',
  value: 'Open'
})`
  position: fixed;
  left: 0;
  top: 0;
  width: 50px;
  height: 50px;
`;

const Explorer = props => {
  const theme = useDetectedTheme();
  const [contentWidth, setContentWidth] = useState();
  const [isHidden, setIsHidden] = useState(false);
  const resizeRef = useRef();
  const contentRef = useRef();

  useEffect(() => {
    const { width } = contentRef.current.getBoundingClientRect();
    setContentWidth(width);
  }, []);

  useMouseDragging(e => {
    const nextIsHidden = e.clientX < props.minResizeWidth;
    setIsHidden(nextIsHidden);
    if (!nextIsHidden) {
      setContentWidth(e.clientX);
    }
  }, resizeRef, 10);

  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        <BodyStyle offsetLeft={isHidden ? 0 : contentWidth} />
        {isHidden && <ToggleButton onClick={e => setIsHidden(false)} />}
        {!isHidden &&
          <ContentWrapper
            isHidden={isHidden}
            contentWidth={contentWidth}
            minWidth={props.minResizeWidth}
            ref={contentRef}
          >
            {props.children}
          </ContentWrapper>
        }
        <ResizeDetect ref={resizeRef} />
      </Wrapper>
    </ThemeProvider>
  );
}

Explorer.propTypes = {
  minResizeWidth: PropTypes.number,
  children: PropTypes.node
};

Explorer.defaultProps = {
  minResizeWidth: 200
};

export default Explorer;
