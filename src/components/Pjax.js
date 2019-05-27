import React, {useContext, useCallback} from 'react';
import PropTypes from 'prop-types';
import {DataSource} from '../context';

const Pjax = ({to, ...rest}) => {
  const {pjax, pjaxContainer} = useContext(DataSource);

  const onClick = useCallback(e => {
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }

    e.preventDefault();
    pjax(to).then(html => {
      const node = document.querySelector(pjaxContainer);
      if (node) {
        node.innerHTML = html;
        window.history.pushState(null, '', to);
      }
    });
  }, [to, pjax, pjaxContainer]);

  return (
    <a
      {...rest}
      href={to}
      onClick={onClick}
    />
  );
}

Pjax.propTypes = {
  to: PropTypes.string.isRequired
};

export default Pjax;
