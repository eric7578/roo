import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Formik, getIn } from 'formik';
import { parse } from 'url';
import { Button } from '../Form';
import useStorage from '../../hooks/useStorage';
import HostCredential from './HostCredential';

const toSafeHostname = hostname => hostname.replace('.', '$');
const fromSafeHostname = hostname => hostname.replace('$', '.');
const HOSTNAME = parse(window.location.href).hostname;
const HOSTNAME_KEY = toSafeHostname(HOSTNAME);

const fromCredentialStorage = credentialStorage => {
  const hostnames = Object.keys(credentialStorage).sort(
    (hostname1, hostname2) => {
      if (hostname1 !== HOSTNAME && hostname2 === HOSTNAME) {
        return 1;
      }
      return 0;
    }
  );
  return hostnames.reduce((formData, hostname) => {
    formData[toSafeHostname(hostname)] = credentialStorage[hostname];
    return formData;
  }, {});
};
const toCredentialStoage = formData => {
  return Object.entries(formData).reduce(
    (credentialStorage, [keyHostname, credential]) => {
      credentialStorage[fromSafeHostname(keyHostname)] = credential;
      return credentialStorage;
    },
    {}
  );
};

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
  const { credentials, syncCredentials } = useStorage();

  const initialFormData = useMemo(() => {
    return fromCredentialStorage(credentials);
  }, []);

  const onSubmitCredentials = useCallback(
    values => {
      const credentials = toCredentialStoage(values);
      syncCredentials(credentials);
    },
    [syncCredentials]
  );

  return (
    <Formik initialValues={initialFormData} onSubmit={onSubmitCredentials}>
      {({ handleSubmit, setFieldValue, values }) => (
        <Form onSubmit={handleSubmit}>
          {Object.keys(values).map(hostname => (
            <HostCredential key={hostname} hostname={hostname} />
          ))}
          <ButtonWrapper>
            <Button type="submit" value="Save" />
            <Button
              value="Add token"
              onClick={e => {
                const settings = getIn(values, `${HOSTNAME_KEY}.settings`, []);
                setFieldValue(`${HOSTNAME_KEY}.settings`, [
                  ...settings,
                  { name: '', value: '' }
                ]);

                const dataSource = getIn(values, `${HOSTNAME_KEY}.dataSource`);
                if (!dataSource) {
                  setFieldValue(`${HOSTNAME_KEY}.dataSource`, HOSTNAME);
                }
              }}
            />
          </ButtonWrapper>
        </Form>
      )}
    </Formik>
  );
};

export default Credentials;
