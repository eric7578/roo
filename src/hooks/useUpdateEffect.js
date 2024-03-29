import { useEffect, useRef } from 'react';

export default function useUpdateEffect(callback, deps) {
  const ref = useRef(false);

  useEffect(() => {
    if (ref.current) {
      return callback();
    }
    ref.current = true;
  }, deps);
}
