import React, {useState, useContext}  from 'react';
import {Repository} from './WithRepository';

const Auth = props => {
  const {auth} = useContext(Repository);
  const [editIndex, setEditIndex] = useState();

  const onAdd = e => {
    auth.modify(auth.value.length);
  }

  const onEdit = (index, field) => e => {
    auth.modify(index, {
      ...auth.value[index],
      [field]: e.target.value
    });
  }

  const onSubmit = e => {
    e.preventDefault();
    auth.save();
  }

  return (
    <form onSubmit={onSubmit}>
      <ul>
        {auth.value.map(({name, token}, idx) =>
          <li key={idx}>
            <input
              type='checkbox'
              checked={idx === auth.selected}
              onChange={e => auth.select(idx)}
            />
            {idx === editIndex
              ? <span>{name}</span>
              : (
                <>
                  <input
                    type='text'
                    value={name}
                    onChange={onEdit(idx, 'name')}
                  />
                  <input
                    type='text'
                    value={token}
                    onChange={onEdit(idx, 'token')}
                  />
                </>
              )
            }
            <input
              type='button'
              value='del'
              onClick={e => auth.remove(idx)}
            />
          </li>
        )}
      </ul>
      <input type='submit' value='save' />
      <input type='button' value='Add account' onClick={onAdd} />
    </form>
  );
}

export default Auth;
