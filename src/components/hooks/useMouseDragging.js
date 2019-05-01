import { useEffect } from 'react';
import window from 'global/window';

export default function useMouseDragging(callback, ref) {
  const onMouseDown = e => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  const onMouseUp = e => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  }

  const onMouseMove = e => {
    e.preventDefault();
    callback(e);
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
