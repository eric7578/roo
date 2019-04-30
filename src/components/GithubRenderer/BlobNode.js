import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const BlobNode = props => {
  const pathname = [
    props.repository.owner,
    props.repository.repo,
    'blob',
    props.repository.sha,
    ...props.prevTrees,
    props.path
  ];

  return (
    <a href={`https://github.com/${pathname.join('/')}`}>
      <FontAwesomeIcon icon='file' />
      {props.path}
    </a>
  );
}

export default BlobNode;
