import { useRef } from 'react';

export default function useMutateValue(callback, value) {
  const prev = useRef();
  if (value !== prev.current) {
    callback(value, prev.current);
    prev.current = value;
  }
}
