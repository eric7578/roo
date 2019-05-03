import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Repository } from '../WithRepository';

const BlobNode = props => {
  const { owner, repo, sha } = useContext(Repository);
  const pathname = [
    owner,
    repo,
    'blob',
    sha,
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
