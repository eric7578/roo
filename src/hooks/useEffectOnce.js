import { useEffect } from 'react';

export default function useEffectOnce(callback) {
  useEffect(() => {
    return callback();
  }, []);
}
