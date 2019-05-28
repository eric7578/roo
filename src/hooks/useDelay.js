import { useRef } from 'react';

export default function useDelay(cb, timeout) {
  const interval = useRef(0);

  return (...args) => {
    window.clearTimeout(interval.current);
    interval.current = window.setTimeout(cb, timeout, ...args);
  }
}
