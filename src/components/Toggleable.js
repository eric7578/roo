import React, {useRef} from 'react';
import PropTypes from 'prop-types';

const Toggleable = props => {
  const isOpenedBefore = useRef(props.initialMount);
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
  initialMount: PropTypes.bool,
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.node
};

Toggleable.defaultProps = {
  initialMount: false
};

export default Toggleable;
