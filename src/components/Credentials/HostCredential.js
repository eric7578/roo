import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useFormikContext, getIn, Field, FieldArray } from 'formik';
import { Button } from '../Form';
import InputField from './InputField';
import TokenField from './TokenField';
import DefaultCheckField from './DefaultCheckField';
import dataSources from './dataSources';

const Wrapper = styled.div`
  padding: 18px;

  > *:not(:first-child) {
    margin-top: 12px;
  }
`;

const Setting = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;

  > *:not(:first-child) {
    margin-top: 8px;
  }
`;

const HostCredential = ({ hostname }) => {
  const { values } = useFormikContext();
  const settings = getIn(values, `${hostname}.settings`);

  return (
    <Wrapper>
      <Field as="select" name={`${hostname}.dataSource`}>
        {dataSources.map(dataSource => (
          <option key={dataSource} value={dataSource}>
            {dataSource}
          </option>
        ))}
      </Field>
      <FieldArray name={`${hostname}.settings`}>
        {arrayHelpers =>
          settings.map((token, index) => (
            <Setting key={index}>
              <InputField
                name={`${hostname}.settings[${index}].name`}
                placeholder="Insert name..."
              />
              <TokenField
                name={`${hostname}.settings[${index}].value`}
                placeholder="Insert token..."
              />
              <DefaultCheckField
                name={`${hostname}.settings[${index}].selected`}
                settingsName={`${hostname}.settings`}
                order={index}
              />
              <Button
                value="Remove"
                onClick={e => arrayHelpers.remove(index)}
              />
            </Setting>
          ))
        }
      </FieldArray>
    </Wrapper>
  );
};

HostCredential.propTypes = {
  hostname: PropTypes.string.isRequired
};

export default HostCredential;
