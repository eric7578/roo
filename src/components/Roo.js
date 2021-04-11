import React, { useState } from 'react';
import useStorage from './useStorage';
import useBackend from './useBackend';
import { Preferences, Backend } from './Context';
import Explorer, { ViewModes } from './Explorer';

export default function Roo() {
  const storage = useStorage('roo');
  const backend = useBackend(storage);
  const [viewMode, setViewMode] = useState(ViewModes.BROWSING);

  return (
    storage.ready &&
    backend.ready && (
      <Preferences.Provider
        value={[storage.preferences, storage.setPreferences]}
      >
        <Backend.Provider value={backend}>
          <Explorer viewMode={viewMode} onChangeViewMode={setViewMode} />
        </Backend.Provider>
      </Preferences.Provider>
    )
  );
}
