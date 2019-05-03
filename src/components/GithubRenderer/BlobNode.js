import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Repository } from '../WithRepository';

const BlobNode = props => {
  const { owner, repo, head } = useContext(Repository);
  const pathname = [
    owner,
    repo,
    'blob',
    head,
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
