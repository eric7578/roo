import React, {useRef, useState, useEffect, useLayoutEffect} from 'react';
import PropTypes from 'prop-types';
import document from 'global/document';
import styled from 'styled-components';
import useMouseDragging from './hooks/useMouseDragging';

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

const ToggleButton = styled.input.attrs({type: 'button'})`
  position: fixed;
  left: 0;
  top: 0;
  width: 50px;
  height: 50px;
`;

const Explorer = props => {
  const [contentWidth, setContentWidth] = useState();
  const [isHidden, setIsHidden] = useState(false);
  const resizeRef = useRef();
  const contentRef = useRef();

  useEffect(() => {
    const {width} = contentRef.current.getBoundingClientRect();
    setContentWidth(width);
  }, []);

  useMouseDragging(e => {
    const nextIsHidden = e.clientX < props.minResizeWidth;
    setIsHidden(nextIsHidden);
    if (!nextIsHidden) {
      setContentWidth(e.clientX);
    }
  }, resizeRef, 10);

  useLayoutEffect(() => {
    const offset = isHidden ? 0 : contentWidth;
    document.body.style.marginLeft = `${offset}px`;
  }, [isHidden, contentWidth]);

  return (
    <Wrapper>
      {isHidden &&
        <ToggleButton
          value='Open'
          onClick={e => setIsHidden(false)}
        />
      }
      {!isHidden &&
        <ContentWrapper
          ref={contentRef}
          style={{
            width: contentWidth,
            minWidth: isHidden ? undefined : props.minResizeWidth
          }}
        >
          {props.children}
        </ContentWrapper>
      }
      <ResizeDetect ref={resizeRef} />
    </Wrapper>
  );
}

Explorer.propTypes = {
  minResizeWidth: PropTypes.number,
  children: PropTypes.node
};

Explorer.defaultProps = {
  minResizeWidth: 300
};

export default Explorer;
