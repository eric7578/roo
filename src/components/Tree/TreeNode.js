import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import icons from 'file-icons-js';
import { Folder, FolderOpen, UnknownFile } from '../icons';
import { treeNodeTypes } from '../../enum';
import { treeNodesSelectorCreator } from './makeTreeSelectors';

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

const UnknownFileIcon = styled(UnknownFile)`
  width: 18px;
  margin-left: -3px;
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

const FileNode = ({ path, isOpen, ...props }) => {
  const iconClass = useMemo(() => icons.getClassWithColor(path), [path]);

  return (
    <NodePath {...props}>
      {iconClass ? <KnownFile className={iconClass} /> : <UnknownFileIcon />}
      {path}
    </NodePath>
  );
};

const TreeNode = ({ node, onClick }) => {
  const treeNodesSelector = useCallback(treeNodesSelectorCreator(), []);
  const treeNodes = useSelector(state => treeNodesSelector(state, node.tree));
  const onClickNode = useCallback(
    e => {
      e.stopPropagation();
      onClick(node);
    },
    [node, onClick]
  );

  return (
    <>
      {node.type === treeNodeTypes.FILE && (
        <FileNode path={node.path} onClick={onClickNode} />
      )}
      {node.type === treeNodeTypes.TREE && (
        <TreePath onClick={onClickNode}>
          {node.isOpen ? <FolderOpen /> : <Folder />}
          {node.path}
        </TreePath>
      )}
      {node.type === treeNodeTypes.TREE && node.isOpen && (
        <TreeList>
          {treeNodes.map(treeNode => (
            <li key={treeNode.fullPath}>
              <TreeNode node={treeNode} onClick={onClick} />
            </li>
          ))}
        </TreeList>
      )}
    </>
  );
};

TreeNode.propTypes = {
  node: PropTypes.shape({
    type: PropTypes.oneOf([treeNodeTypes.FILE, treeNodeTypes.TREE]),
    path: PropTypes.string.isRequired,
    fullPath: PropTypes.string.isRequired,
    isOpen: PropTypes.bool
  }),
  onClick: PropTypes.func
};

export default TreeNode;
