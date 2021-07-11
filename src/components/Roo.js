import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Storage from './Storage';
import Backend from './Backend';
import Explorer from './Explorer';
import Credentials from './Credentials';
import Search from './Search';
import Browser from './Browser';
import { ViewModes } from '../enum';

const ToggleWrapper = styled.div`
  display: ${props => (props.visible ? 'block' : 'none')};
`;

export default function Roo() {
  return (
    <Storage>
      <Backend>
        <Explorer>
          {({ viewMode }) => (
            <>
              <ToggleWrapper visible={viewMode === ViewModes.BROWSING}>
                <Browser />
              </ToggleWrapper>
              <ToggleWrapper visible={viewMode === ViewModes.SEARCH}>
                <Search />
              </ToggleWrapper>
              {viewMode === ViewModes.CREDENTIALS && <Credentials />}
              {viewMode === ViewModes.PREFERENCES}
            </>
          )}
        </Explorer>
      </Backend>
    </Storage>
  );
}
