import React, {useContext} from 'react';
import {Repository} from '../../context';

const CommitNode = props => {
  const {params} = useContext(Repository);
  const pathname = [
    params.owner,
    params.repo,
    'commit',
    params.commit
  ];

  return (
    <>
      <a href={`https://github.com/${pathname.join('/')}#diff-${props.index}`}>
        {props.path}
      </a>
      <span>{`+${props.additions} -${props.deletions}`}</span>
    </>
  );
}

export default CommitNode;
