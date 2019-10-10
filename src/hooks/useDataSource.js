import { useContext } from 'react';
import { DataSource } from '../context';

export function useTokens() {
  const { tokens, setTokens } = useContext(DataSource);
  return {
    tokens,
    setTokens
  };
}

export function usePreferences() {
  const { preferences, setPreferences } = useContext(DataSource);
  return {
    preferences,
    setPreferences
  };
}
