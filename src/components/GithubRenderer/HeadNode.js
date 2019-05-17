import React, {useContext} from 'react';
import {Repository} from '../../context';

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
    <a
      className={props.className}
      href={`https://github.com/${pathname.join('/')}`}
    >
      {props.children}
    </a>
  );
}

export default HeadNode;
