import {useRef} from 'react';

export default function useDerivedState(callback, value) {
  const prevValue = useRef();

  if (value !== prevValue.current) {
    callback(prevValue.current);
    prevValue.current = value;
  }
}
