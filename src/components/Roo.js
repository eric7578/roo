import React, { useEffect, useState } from 'react';
import useStorage from './useStorage';
import useBackend from './useBackend';
import { Preferences, Backend } from './Context';
import Explorer from './Explorer';

export default function Roo() {
  const storage = useStorage('roo');
  const backend = useBackend(storage);
  console.log(storage, backend);

  return (
    storage.ready &&
    backend.ready && (
      <Preferences.Provider value={storage.preferences}>
        <Backend.Provider value={backend}>
          <Explorer />
        </Backend.Provider>
      </Preferences.Provider>
    )
  );
}
