import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '../Form';
import CredentialSet from './CredentialSet';
import {
  modifyCredential,
  saveCredential,
  addCredential,
  removeCredential,
  setDefaultCredential
} from '../../modules/dataSource';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ButtonWrapper = styled.div`
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
  padding: 18px;
  z-index: 1;

  ${Button}:not(:first-child) {
    margin-left: 5px;
  }
`;

const Credentials = props => {
  const dispatch = useDispatch();
  const credential = useSelector(state =>
    state.dataSource.credentials.get(window.location.hostname)
  );

  return (
    <Form
      onSubmit={e => {
        e.preventDefault();
        dispatch(saveCredential());
      }}
    >
      <CredentialSet
        {...credential}
        onChange={(field, ...args) => {
          if (field == 'selected') {
            dispatch(setDefaultCredential(...args));
          } else {
            dispatch(modifyCredential(field, ...args));
          }
        }}
        onRemove={index => dispatch(removeCredential(index))}
      />
      <ButtonWrapper>
        <Button type="submit" value="Save" />
        <Button
          value="Add token"
          onClick={e => {
            dispatch(addCredential());
          }}
        />
      </ButtonWrapper>
    </Form>
  );
};

export default Credentials;
