import React from 'react';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({
  adapter: new Adapter()
});

const RunHook = props => {
  props.runHook();
  return null;
};

export const testHook = runHook => {
  mount(<RunHook runHook={runHook} />);
};
