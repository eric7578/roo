import React, {useContext} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Repository} from '../WithRepository';

const HeadNode = props => {
  const {params, repo} = useContext(Repository);
  const pathname = [
    params.owner,
    params.repo,
    'blob',
    params.head || repo.defaultBranch,
    ...props.parentPath,
    props.path
  ];

  return (
    <a href={`https://github.com/${pathname.join('/')}`}>
      <FontAwesomeIcon icon='file' />
      {props.path}
    </a>
  );
}

export default HeadNode;
