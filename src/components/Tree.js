import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getClassWithColor } from 'file-icons-js';
import { Folder, FolderOpen, UnknownFile } from './icons';

import 'file-icons-js/css/style.css';

const TreeNodesList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const TreeNode = styled.li`
  padding-left: ${props => props.depth * 15}px;
  background-color: ${props => (props.focused ? '#0d1117' : 'none')};
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

export default function Tree(props) {
  const { tree, compressSingleDir, onExpand, onNavigate } = props;

  const treeNodes = useMemo(
    () =>
      Object.entries(tree)
        .map(([name, node]) => {
          let children = Object.keys(node.tree);
          let numChildren = children.length;

          if (compressSingleDir) {
            const compressPath = [name];
            while (true) {
              // compress node is node has only one children
              const childrenPath = Object.keys(node.tree);
              if (childrenPath.length !== 1) {
                break;
              }

              // compress if the next child is not file
              const childPath = childrenPath[0];
              if (Object.keys(node.tree[childPath].tree).length === 0) {
                break;
              }

              compressPath.push(childPath);
              node = node.tree[childPath];
            }
            name = compressPath.join('/');
          }

          return {
            ...node,
            icon: getClassWithColor(name),
            isFile: numChildren === 0,
            name
          };
        })
        .sort((n1, n2) => {
          if (n1.isFile === n2.isFile) {
            return n1.name.localeCompare(n2.name);
          } else if (n2.isFile && !n1.isFile) {
            return -1;
          }
          return 0;
        }),
    [tree, compressSingleDir]
  );

  return (
    <TreeNodesList>
      {treeNodes.map(node => (
        <React.Fragment key={node.name}>
          <TreeNode
            depth={props.depth}
            focused={node.fullPath === props.focusPath}
          >
            <NodePath
              onClick={e => {
                if (node.isFile) {
                  onNavigate(node);
                } else {
                  onExpand(node);
                }
              }}
            >
              {node.isFile ? (
                <FileNode icon={node.icon} />
              ) : (
                <FolderNode open={node.open} />
              )}
              {node.name}
            </NodePath>
          </TreeNode>
          {!node.isFile && node.open && (
            <Tree {...props} depth={props.depth + 1} tree={node.tree} />
          )}
        </React.Fragment>
      ))}
    </TreeNodesList>
  );
}

Tree.propTypes = {
  depth: PropTypes.number,
  tree: PropTypes.object.isRequired,
  focusPath: PropTypes.string,
  compressSingleDir: PropTypes.bool,
  onNavigate: PropTypes.func
};

Tree.defaultProps = {
  depth: 0,
  compressSingleDir: true
};

function FileNode({ icon }) {
  return icon ? (
    <KnownFile className={icon} />
  ) : (
    <UnknownFile style={{ width: 18, marginLeft: -3 }} />
  );
}

function FolderNode({ open }) {
  return open ? <FolderOpen /> : <Folder />;
}
