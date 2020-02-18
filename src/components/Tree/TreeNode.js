import React, { useContext, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import icons from 'file-icons-js';
import { Folder, FolderOpen, UnknownFile } from '../icons';
import { createTreeNodesSelector } from './makeTreeSelectors';
import context from './context';

const TreeList = styled.ol`
  list-style-type: none;
  margin: 0;
  padding: 0;
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
  padding-left: ${props => props.depth * 15}px;
  white-space: nowrap;

  svg {
    fill: #fff;
    margin-right: 5px;
    min-width: 16px;
    width: 16px;
  }
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

const FolderNode = ({ path, isOpen, ...props }) => {
  return (
    <NodePath {...props}>
      {isOpen ? <FolderOpen /> : <Folder />}
      {path}
    </NodePath>
  );
};

const TreeNode = ({ depth, node, onClick }) => {
  const treeType = useContext(context);
  const selectTreeNodes = useCallback(createTreeNodesSelector(treeType), [
    treeType
  ]);
  const treeNodes = useSelector(state => {
    return selectTreeNodes(state, node.tree);
  });
  const onClickNode = useCallback(
    e => {
      e.stopPropagation();
      onClick(node);
    },
    [node, onClick]
  );

  return (
    <>
      {node.isFile ? (
        <FileNode depth={depth} path={node.path} onClick={onClickNode} />
      ) : (
        <FolderNode
          depth={depth}
          path={node.path}
          isOpen={node.isOpen}
          onClick={onClickNode}
        />
      )}
      {node.isDir && node.isOpen && (
        <TreeList>
          {treeNodes.map(treeNode => (
            <li key={treeNode.fullPath}>
              <TreeNode depth={depth + 1} node={treeNode} onClick={onClick} />
            </li>
          ))}
        </TreeList>
      )}
    </>
  );
};

TreeNode.propTypes = {
  depth: PropTypes.number,
  node: PropTypes.shape({
    path: PropTypes.string.isRequired,
    fullPath: PropTypes.string.isRequired,
    isOpen: PropTypes.bool,
    isFile: PropTypes.bool,
    isDir: PropTypes.bool,
    tree: PropTypes.instanceOf(Set)
  }),
  onClick: PropTypes.func
};

export default TreeNode;
