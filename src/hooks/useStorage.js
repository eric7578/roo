import {useContext} from 'react';
import {Storage} from '../context';

export function useTokens() {
  const {selectedToken, tokens, setTokens} = useContext(Storage);
  return {
    selectedToken,
    tokens,
    setTokens
  };
}

export function usePreferences() {
  const {preferences, setPreferences} = useContext(Storage);
  return {
    preferences,
    setPreferences
  };
}
