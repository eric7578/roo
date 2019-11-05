import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useFormikContext, getIn } from 'formik';

const DefaultLabel = styled.label`
  color: ${props => (props.checked ? '#fafafa' : 'inherit')};
  flex: 1;
  font-size: 10px;
`;

const DefaultCheck = styled.input.attrs({ type: 'checkbox' })`
  margin-right: 5px;
`;

const DefaultCheckField = ({ name, settingsName, order }) => {
  const { values, setFieldValue } = useFormikContext();
  const checked = getIn(values, name);
  const onChange = useCallback(
    e => {
      let settings = getIn(values, settingsName);
      settings = settings.map((setting, idx) => {
        setting.selected = e.target.checked && idx === order;
        return setting;
      });
      setFieldValue(settingsName, settings);
    },
    [values, order]
  );

  return (
    <DefaultLabel checked={checked}>
      <DefaultCheck checked={checked} onChange={onChange} />
      Default
    </DefaultLabel>
  );
};

DefaultCheckField.propTypes = {
  name: PropTypes.string.isRequired,
  settingsName: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired
};

export default DefaultCheckField;
