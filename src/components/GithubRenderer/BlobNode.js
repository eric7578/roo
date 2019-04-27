import React from 'react';

const BlobNode = props => {
  const { repository, tree, children, ...rest } = props;
  const pathname = [
    repository.owner,
    repository.repo,
    'blob',
    repository.sha,
    ...tree.prevTrees,
    tree.path
  ];

  return (
    <a
      href={`https://github.com/${pathname.join('/')}`}
      {...rest}
    >
      {children}
    </a>
  );
}

export default BlobNode;
