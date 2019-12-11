import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '../Form';
import CredentialSet from './CredentialSet';
import {
  modifyCredential,
  saveCredential,
  addCredential,
  removeCredential
} from '../../modules/credentials';

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
  const credentials = useSelector(state =>
    Object.entries(state.credentials).reduce(
      (credentials, [hostname, credential]) => {
        credential = {
          ...credential,
          hostname
        };
        if (hostname === window.location.hostname) {
          credentials.unshift(credential);
        } else {
          credentials.push(credential);
        }
        return credentials;
      },
      []
    )
  );

  return (
    <Form
      onSubmit={e => {
        e.preventDefault();
        dispatch(saveCredential());
      }}
    >
      {credentials.map(credential => (
        <CredentialSet
          {...credential}
          key={credential.hostname}
          onChange={(...args) =>
            dispatch(modifyCredential(window.location.hostname, ...args))
          }
          onRemove={index =>
            dispatch(removeCredential(window.location.hostname, index))
          }
        />
      ))}
      <ButtonWrapper>
        <Button type="submit" value="Save" />
        <Button
          value="Add token"
          onClick={e => {
            dispatch(addCredential(window.location.hostname));
          }}
        />
      </ButtonWrapper>
    </Form>
  );
};

export default Credentials;
