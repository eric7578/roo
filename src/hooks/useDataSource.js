import { useContext } from 'react';
import { DataSource } from '../context';

export default function useDataSource() {
  return useContext(DataSource);
}
