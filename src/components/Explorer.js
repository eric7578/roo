import React, {useRef, useState, useEffect, useLayoutEffect} from 'react';
import PropTypes from 'prop-types';
import document from 'global/document';
import useDetectedTheme from './hooks/useDetectedTheme';
import useMouseDragging from './hooks/useMouseDragging';
import './Explorer.css';

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

  useLayoutEffect(() => {
    const offset = isHidden ? 0 : contentWidth;
    document.body.style.marginLeft = `${offset}px`;
  }, [isHidden, contentWidth]);

  return (
    <div
      className='roo-explorer'
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.color
      }}
    >
      {isHidden &&
        <input
          type='button'
          value='Open'
          className='roo-explorer-toggle-button'
          onClick={e => setIsHidden(false)}
        />
      }
      {!isHidden &&
        <div
          className='roo-explorer-content-wrapper'
          ref={contentRef}
          style={{
            width: contentWidth,
            minWidth: isHidden ? undefined : props.minResizeWidth
          }}
        >
          {props.children}
        </div>
      }
      <div ref={resizeRef} className='roo-explorer-resize-detect' />
    </div>
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
