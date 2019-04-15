import React from 'react';

export const BlobNode = props => {
  const { owner, repo, sha, parentPath, children, ...rest } = props
  return (
    <a
      href={`https://github.com/${owner}/${repo}/blob/${sha}/${parentPath.join('/')}`}
      {...rest}
    >
      {children}
    </a>
  );
}
