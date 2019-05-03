import React, { useContext } from 'react';
import { Repository } from '../WithRepository';

const PRBlobNode = props => {
  const { owner, repo, pr } = useContext(Repository);
  const pathname = [
    owner,
    repo,
    'pull',
    pr,
    'files'
  ];

  return (
    <>
      <a href={`https://github.com/${pathname.join('/')}#diff-${props.index}`}>
        {props.path}
      </a>
      <div>{`+${props.additions}`}</div>
      <div>{`-${props.deletions}`}</div>
    </>
  );
}

export default PRBlobNode;
