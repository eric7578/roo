import { useEffect, useRef } from 'react';

export default function useMouseDragging(callbacks, ref, bufferX = 0) {
  const prevClientX = useRef();

  const onMouseDown = e => {
    prevClientX.current = e.clientX;
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const onMouseUp = e => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    callbacks.onStop(e);
  };

  const onMouseMove = e => {
    e.preventDefault();

    const diffX = Math.abs(e.clientX - prevClientX.current);
    if (diffX > bufferX) {
      callbacks.onDrag(e);
      prevClientX.current = e.clientX;
    }
  };

  useEffect(() => {
    ref.current.addEventListener('mousedown', onMouseDown);

    return () => {
      ref.current.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [ref.current]);
}
