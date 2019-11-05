import { useContext } from 'react';
import { Context } from '../components/DataSource';

export default function useDataSource() {
  return useContext(Context);
}
