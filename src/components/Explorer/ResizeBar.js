import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ResizeDetect = styled.div`
  cursor: col-resize;
  height: 100vh;
  position: absolute;
  top: 0;
  right: 0;
  width: 3px;
`;

const ResizeBar =  props => {
  const ref = useRef();

  useEffect(() => {
    let prevClientX = 0;

    const onMouseDown = e => {
      prevClientX = e.clientX;
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    };

    const onMouseUp = e => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      props.onStop(e.clientX);
    };

    const onMouseMove = e => {
      e.preventDefault();

      const diffX = Math.abs(e.clientX - prevClientX);
      if (diffX > 10) {
        props.onDrag(e.clientX);
        prevClientX = e.clientX;
      }
    };

    ref.current.addEventListener('mousedown', onMouseDown);

    return () => {
      ref.current.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return <ResizeDetect ref={ref} />;
};

ResizeBar.propTypes = {
  onDrag: PropTypes.func,
  onStop: PropTypes.func
};

export default ResizeBar;
