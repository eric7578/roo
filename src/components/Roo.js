import React, { useEffect, useState } from 'react';
import Storage from './Storage';
import Backend from './Backend';
import Explorer from './Explorer';
import Credentials from './Credentials';
import Browser from './Browser';
import { ViewModes } from '../enum';

export default function Roo() {
  return (
    <Storage>
      <Backend>
        <Explorer>
          {({ viewMode }) => (
            <>
              {viewMode === ViewModes.BROWSING && <Browser />}
              {viewMode === ViewModes.CREDENTIALS && <Credentials />}
              {viewMode === ViewModes.SEARCH}
              {viewMode === ViewModes.PREFERENCES}
            </>
          )}
        </Explorer>
      </Backend>
    </Storage>
  );
}
