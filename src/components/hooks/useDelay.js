import { useRef } from 'react';
import window from 'global/window';

export default function useDelay(cb, timeout) {
  const interval = useRef(0);

  return (...args) => {
    window.clearTimeout(interval.current);
    interval.current = window.setTimeout(cb, timeout, ...args);
  }
}
