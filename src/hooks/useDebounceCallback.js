import { useRef, useCallback, useEffect } from 'react';

export default function useDebounceCallback(callback, debounceTime) {
  const refTimer = useRef();
  const refCallback = useRef(callback);

  useEffect(() => {
    return () => {
      clearTimeout(refTimer.current);
    };
  }, []);

  return useCallback(
    (...args) => {
      clearTimeout(refTimer.current);
      refTimer.current = setTimeout(() => {
        refCallback.current(...args);
      }, debounceTime);
    },
    [debounceTime]
  );
}
