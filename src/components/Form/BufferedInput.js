import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Input } from './theme';

const BufferedInput = ({ onChange, ms, ...props }) => {
  const interval = useRef();

  return (
    <Input
      {...props}
      onChange={e => {
        const { value } = e.target;
        clearTimeout(interval.current);
        interval.current = setTimeout(() => onChange(value), ms);
      }}
    />
  );
};

BufferedInput.propTypes = {
  ms: PropTypes.number
};

BufferedInput.defaultProps = {
  ms: 300
};

export default BufferedInput;
