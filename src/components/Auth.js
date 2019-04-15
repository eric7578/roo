import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Auth = props => {
  const [auth, setAuth] = useState(() => props.getAuth());

  const onChangeDefault = index => e => {
    setAuth(auth.map((item, i) => {
      return {
        ...item,
        asDefault: i === index && e.target.checked
      };
    }));
  }

  const onEdit = (field, index) => e => {
    setAuth([
      ...auth.slice(0, index),
      {
        ...auth[index],
        [field]: e.target.value
      },
      ...auth.slice(index + 1)
    ]);
  }

  const onDelete = index => e => {
    setAuth([
      ...auth.slice(0, index),
      ...auth.slice(index + 1)
    ]);
  }

  const onAdd = e => {
    setAuth([
      ...auth,
      {
        edit: true,
        asDefault: auth.length === 0,
        name: '',
        token: ''
      }
    ]);
  }

  const onSubmit = e => {
    e.preventDefault();

    const nextAuth = auth.map(({ edit, ...item }) => item);
    setAuth(nextAuth);
    props.setAuth(nextAuth);
  }

  const onCancel = e => {
    setAuth(props.getAuth());
  }

  return (
    <form onSubmit={onSubmit}>
      <ul>
        {auth.map(({ name, edit, asDefault }, idx) =>
          <li key={idx}>
            <input type='checkbox' checked={asDefault} onChange={onChangeDefault(idx)} />
            {!edit && <span>{name}</span>}
            {edit && <input type='text' onChange={onEdit('name', idx)} />}
            {edit && <input type='text' onChange={onEdit('token', idx)} />}
            <input type='button' value='del' onClick={onDelete(idx)} />
          </li>
        )}
      </ul>
      <input type='button' value='cancel' onClick={onCancel} />
      <input type='submit' value='save' />
      <input type='button' value='Add account' onClick={onAdd} />
    </form>
  );
}

Auth.propTypes = {
  getAuth: PropTypes.func.isRequired,
  setAuth: PropTypes.func.isRequired
};

export default Auth;
