import React, {useContext} from 'react';
import {Repository} from '../../context';
import PJAXLink from '../PJAXLink';

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
    <PJAXLink
      className={props.className}
      href={`https://github.com/${pathname.join('/')}`}
    >
      {props.children}
    </PJAXLink>
  );
}

export default HeadNode;
