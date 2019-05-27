import React from 'react';
import PropTypes from 'prop-types';

const Toggleable = props => {
  return (
    <div
      className={props.className}
      style={{display: props.isOpen ? undefined : 'none'}
    }>
      {props.children}
    </div>
  );
}

Toggleable.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.node
};

export default Toggleable;
