import React, {useRef} from 'react';
import PropTypes from 'prop-types';

const Toggleable = props => {
  const isOpenedBefore = useRef(false);
  if (props.isOpen) {
    isOpenedBefore.current = true;
  }

  if (!isOpenedBefore.current) {
    return null;
  }

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
