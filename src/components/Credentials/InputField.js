import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { getIn, useFormikContext } from 'formik';
import { Input } from '../Form';

const InputField = ({ name, ...props }) => {
  const { setFieldValue, values } = useFormikContext();
  const value = getIn(values, name);
  const onChange = useCallback(
    e => {
      setFieldValue(name, e.target.value);
    },
    [name, setFieldValue]
  );

  // if type is password use a placeholder 'secretcat' as default value
  return <Input value={value} onChange={onChange} {...props} />;
};

InputField.propTypes = {
  name: PropTypes.string,
  placeholder: PropTypes.string
};

export default InputField;
