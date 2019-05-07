import React, {useContext} from 'react';
import {Repository} from '../WithRepository';

const PrNode = props => {
  const {params} = useContext(Repository);
  const pathname = [
    params.owner,
    params.repo,
    'pull',
    params.pr,
    'files'
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

export default PrNode;
