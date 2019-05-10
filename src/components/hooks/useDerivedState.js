import {useState} from 'react';

export default function useDerivedState(callback, propValue) {
  const [prevPropValue, setPrevPropValue] = useState();

  if (propValue !== prevPropValue) {
    callback();
    setPrevPropValue(propValue);
  }
}