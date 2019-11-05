import React, { useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import icons from 'file-icons-js';
import { Folder, FolderOpen, UnknownFile } from '../icons';
import { TREE, FILE } from '../../types/TreeNodeTypes';
import { Context } from './Tree';

const TreeList = styled.ol`
  list-style-type: none;
  margin: 0 0 0 15px;
  padding: 0;
`;

const TreePath = styled.div`
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

const UnknownFileIcon = style(UnknownFile)`
  width: 18px;
  margin-left: -3px;
`;

const FileNode = ({ path, ...props }) => {
  const iconClass = useMemo(() => icons.getClassWithColor(path), [path]);

  return (
    <NodePath {...props}>
      {iconClass ? <KnownFile className={iconClass} /> : <UnknownFileIcon />}
      {path}
    </NodePath>
  );
};

const TreeNode = ({ absPath, onNavigate, onToggle }) => {
  const state = useContext(Context);
  const node = useMemo(() => state.get(absPath), [state, absPath]);

  return (
    <>
      {node.type === FILE && (
        <FileNode path={node.path} onClick={e => onNavigate(absPath)} />
      )}
      {node.type === TREE && (
        <TreePath onClick={e => onToggle(absPath)}>
          {isOpen ? <FolderOpen /> : <Folder />}
          {node.path}
        </TreePath>
      )}
      {node.type === TREE && (
        <TreeList>
          {tree.map(absPath => (
            <li key={node.path}>
              <TreeNode
                absPath={absPath}
                onNavigate={onNavigate}
                onExpand={onExpand}
              />
            </li>
          ))}
        </TreeList>
      )}
    </>
  );
};

TreeNode.propTypes = {
  absPath: PropTypes.string,
  onNavigate: PropTypes.func,
  onToggle: PropTypes.func
};

export default TreeNode;
