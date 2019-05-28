import React, {useContext, useCallback} from 'react';
import {DataSource, Pjax} from '../context';

const WithPjax = props => {
  const {pjax, pjaxContainer} = useContext(DataSource);

  const pjaxTo = useCallback(to => {
    pjax(to).then(html => {
      const node = document.querySelector(pjaxContainer);
      if (node) {
        node.innerHTML = html;
        window.history.pushState(null, '', to);
      }
    });
  }, [pjax, pjaxContainer]);

  return (
    <Pjax.Provider value={{pjaxTo}}>
      {props.children}
    </Pjax.Provider>
  );
}

export default WithPjax;
