import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Input } from '../Form';
import { getIn, useFormikContext } from 'formik';

const TokenField = ({ name, placeholder }) => {
  const { setFieldValue, values } = useFormikContext();
  const value = getIn(values, name);
  const [isFocus, setIsFocus] = useState(false);
  const onFocus = useCallback(
    e => {
      setIsFocus(true);
    },
    [setIsFocus]
  );
  const onBlur = useCallback(
    e => {
      setIsFocus(false);
    },
    [setIsFocus]
  );
  const onChange = useCallback(
    e => {
      setFieldValue(name, e.target.value);
    },
    [name, setFieldValue]
  );

  // if type is password use a placeholder 'secretcat' as default value
  return (
    <Input
      placeholder={value ? 'Focus here to reveal' : placeholder}
      value={isFocus ? value : ''}
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={onChange}
    />
  );
};

TokenField.propTypes = {
  name: PropTypes.string,
  placeholder: PropTypes.string
};

export default TokenField;
