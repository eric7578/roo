import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Input } from '../Form';
import { dataSourceTypes } from '../../enum';

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

const DefaultLabel = styled.label`
  color: ${props => (props.checked ? '#fafafa' : 'inherit')};
  flex: 1;
  font-size: 10px;
`;

const DefaultCheck = styled.input.attrs({ type: 'checkbox' })`
  margin-right: 5px;
`;

const CredentialSet = ({
  hostname,
  dataSource,
  tokens,
  onChange,
  onRemove
}) => {
  return (
    <Wrapper>
      <h2>{hostname}</h2>
      <select
        value={dataSource}
        onChange={e => {
          onChange('dataSource', e.target.value);
        }}
      >
        {dataSourceTypes.map(type => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      {tokens.map((token, index) => (
        <Setting key={`${token.value}_${index}`}>
          <Input
            defaultValue={token.value}
            onBlur={e => onChange('value', e.target.value, index)}
          />
          <DefaultLabel checked={token.selected}>
            <DefaultCheck
              checked={token.selected}
              onChange={e => onChange('selected', e.target.checked, index)}
            />
            Default
          </DefaultLabel>
          <Button value="Remove" onClick={e => onRemove(index)} />
        </Setting>
      ))}
    </Wrapper>
  );
};

CredentialSet.propTypes = {
  hostname: PropTypes.string,
  dataSource: PropTypes.string,
  tokens: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      selected: PropTypes.bool
    })
  ),
  onChange: PropTypes.func,
  onRemove: PropTypes.func
};

export default CredentialSet;
