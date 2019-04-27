import React from 'react';

const BlobNode = props => {
  const { repository, path, prevTrees, children, ...rest } = props;

  return (
    <a
      href={`https://github.com/${repository.owner}/${repository.repo}/blob/${repository.sha}/${prevTrees.join('/')}/${path}`}
      {...rest}
    >
      {children}
    </a>
  );
}

export default BlobNode;
