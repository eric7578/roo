import React, {useReducer, useCallback} from 'react';
import {Storage} from '../context';
import {saveTokens, retrieveTokens, savePreferences, retrievePreferences} from '../db';
import useEffectOnce from '../hooks/useEffectOnce';

const reducer = (state, action) => {
  switch (action.type) {
    case 'updateTokens':
      const selectedToken = action.tokens.find(t => t.selected);
      return {
        ...state,
        selectedToken: selectedToken ? selectedToken.value : null,
        tokens: action.tokens
      };

    case 'updatePreferences':
      return {
        ...state,
        preferences: action.preferences
      };

    default:
      return state;
  }
}

const WithStorage = props => {
  const [state, dispatch] = useReducer(reducer, {});

  const updatePreferences = useCallback(preferences => {
    dispatch({
      type: 'updatePreferences',
      preferences
    });
  }, [dispatch]);

  const updateTokens = useCallback(tokens => {
    dispatch({
      type: 'updateTokens',
      tokens
    });
  }, [dispatch]);

  useEffectOnce(async () => {
    const [preferences, tokens] = await Promise.all([
      retrievePreferences(),
      retrieveTokens()
    ]);
    updatePreferences(preferences);
    updateTokens(tokens);
  });

  const setPreferences = async (key, value) => {
    const preferences = {
      ...state.preferences,
      [key]: value
    };
    await savePreferences(preferences);
    updatePreferences(preferences);
  }

  const setTokens = async tokens => {
    await saveTokens(tokens);
    updateTokens(tokens);
  }

  return (
    <Storage.Provider
      value={{
        ...state,
        setPreferences,
        setTokens
      }}
    >
      {state.preferences && state.tokens && props.children}
    </Storage.Provider>
  );
}

export default WithStorage;
