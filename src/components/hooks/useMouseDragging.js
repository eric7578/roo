import {useEffect, useRef} from 'react';
import window from 'global/window';

export default function useMouseDragging(callback, ref, bufferX = 0) {
  const prevClientX = useRef();

  const onMouseDown = e => {
    prevClientX.current = e.clientX;
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  const onMouseUp = e => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  }

  const onMouseMove = e => {
    e.preventDefault();

    const diffX = Math.abs(e.clientX - prevClientX.current);
    if (diffX > bufferX) {
      callback(e);
      prevClientX.current = e.clientX;
    }
  }

  useEffect(() => {
    ref.current.addEventListener('mousedown', onMouseDown);

    return () => {
      ref.current.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }
  }, [ref.current]);
}
