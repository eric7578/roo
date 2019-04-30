import React from 'react';

const PRBlobNode = props => {
  const pathname = [
    props.repository.owner,
    props.repository.repo,
    'pull',
    props.repository.pr,
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
