import { useContext } from 'react';
import { Context } from '../components/Storage';

export default function useStorage() {
  return useContext(Context);
}
