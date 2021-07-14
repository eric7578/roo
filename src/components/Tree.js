import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TreeNodesList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const TreeNode = styled.li`
  padding-left: ${props => props.depth * 15}px;
  background-color: ${props => (props.focused ? '#0d1117' : 'none')};
`;

export default function Tree(props) {
  const { tree, compressSingleDir, children } = props;

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
            {children({ node })}
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
  children: PropTypes.func.isRequired,
  compressSingleDir: PropTypes.bool
};

Tree.defaultProps = {
  depth: 0,
  compressSingleDir: true
};
