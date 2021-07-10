import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getClassWithColor } from 'file-icons-js';
import { Folder, FolderOpen, UnknownFile } from './icons';

import 'file-icons-js/css/style.css';

const TreeNodesList = styled.ul`
  list-style-type: none;
  margin: 0 0 0 15px;
  padding: 0;
`;

const NodePath = styled.div`
  align-items: center;
  display: flex;
  color: #fafafa;
  cursor: pointer;
  white-space: nowrap;

  svg {
    fill: #fff;
    margin-right: 5px;
    min-width: 16px;
    width: 16px;
  }
`;

const KnownFile = styled.i`
  font-style: normal;
  margin-right: 5px;
`;

export default function Tree({ tree, onExpand }) {
  const treeNodes = useMemo(
    () =>
      Object.entries(tree)
        .map(([name, node]) => ({
          ...node,
          icon: getClassWithColor(name),
          isFile: Object.keys(node.tree).length === 0,
          name
        }))
        .sort((n1, n2) => {
          if (n1.isFile === n2.isFile) {
            return n1.name.localeCompare(n2.name);
          } else if (n2.isFile && !n1.isFile) {
            return -1;
          }
          return 0;
        }),
    [tree]
  );

  return (
    <TreeNodesList>
      {treeNodes.map(node => (
        <li key={node.name}>
          <TreeNode {...node} onClick={e => onExpand(node)} />
          {!node.isFile && node.open && (
            <Tree tree={node.tree} onExpand={onExpand} />
          )}
        </li>
      ))}
    </TreeNodesList>
  );
}

Tree.propTypes = {
  tree: PropTypes.object,
  onExpand: PropTypes.func
};

function TreeNode({ icon, isFile, open, name, ...rest }) {
  return (
    <NodePath {...rest}>
      {isFile &&
        (icon ? (
          <KnownFile className={icon} />
        ) : (
          <UnknownFile style={{ width: 18, marginLeft: -3 }} />
        ))}
      {!isFile && (open ? <FolderOpen /> : <Folder />)}
      {name}
    </NodePath>
  );
}
