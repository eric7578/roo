import React, { useContext } from 'react';
import { Repository } from '../WithRepository';

const PRBlobNode = props => {
  const { owner, repo, commit } = useContext(Repository);
  const pathname = [
    owner,
    repo,
    'commit',
    commit
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
