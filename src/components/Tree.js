import React, {createElement, createContext, useContext, useState, useMemo, useEffect} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Toggleable from './Toggleable';
import useDerivedState from './hooks/useDerivedState';
import {Folder, FolderOpen, File} from './icons';

const ChildTree = styled.ul`
  list-style-type: none;
  margin: 0 0 0 15px;
  padding: 0;
`;

const ChildTreeNode = styled.li`
  cursor: pointer;
`;

const NodePath = styled.div`
  align-items: center;
  display: flex;
  color: #fafafa;

  svg {
    fill: #fff;
    margin-right: 3px;
    min-width: 16px;
    width: 16px;
  }
`;

const TreeContext = createContext();

const TreeNode = props => {
  const {defaultOpen, blobNodeComponent, onExpand} = useContext(TreeContext);
  const isTree = props.type === 'tree';
  const isBlob = props.type === 'blob';
  const [isOpen, setIsOpen] = useState(false);
  const nextLevelParentPath = useMemo(() => ([...props.parentPath, props.path]), [props.path]);

  useEffect(() => {
    if (isTree && defaultOpen && props.path === defaultOpen[props.depth]) {
      setIsOpen(true);
    }
  }, [defaultOpen]);

  useDerivedState(() => {
    // ignore when using cache
    if (isTree && props.tree && props.tree.length > 0) {
      return;
    }
    if (isOpen && onExpand) {
      onExpand(props.sha);
    }
  }, isOpen);

  const onToggleOpen = e => {
    setIsOpen(!isOpen);
  }

  return (
    <>
      {isBlob && createElement(blobNodeComponent, {
        ...props,
        children: (
          <NodePath>
            <File />
            {props.path}
          </NodePath>
        )
      })}
      {isTree &&
        <>
          <NodePath onClick={isTree ? onToggleOpen : undefined}>
            {isOpen ? <FolderOpen /> : <Folder />}
            {props.path}
          </NodePath>
          <Toggleable isOpen={isOpen}>
            {props.tree && props.tree.length > 0 &&
              <ChildTree>
                {props.tree.map(node => {
                  return (
                    <ChildTreeNode key={node.sha || node.path}>
                      <TreeNode
                        {...node}
                        parentPath={nextLevelParentPath}
                        open={open}
                        blobNodeComponent={blobNodeComponent}
                        depth={props.depth + 1}
                        defaultOpen={props.defaultOpen}
                        onExpand={props.onExpand}
                      />
                    </ChildTreeNode>
                  );
                })}
              </ChildTree>
            }
          </Toggleable>
        </>
      }
    </>
  );
}

TreeNode.propTypes = {
  sha: PropTypes.oneOfType([PropTypes.string, PropTypes.symbol]).isRequired,
  type: PropTypes.oneOf(['blob', 'tree']).isRequired,
  path: PropTypes.string.isRequired,
  parentPath: PropTypes.arrayOf(PropTypes.string).isRequired,
  tree: PropTypes.array,
  depth: PropTypes.number
};

TreeNode.defaultProps = {
  parentPath: []
};

const Tree = props => {
  const {tree, ...ctx} = props;
  return (
    <TreeContext.Provider
      value={ctx}
    >
      {tree ? tree.map(node =>
        <TreeNode
          {...node}
          key={node.sha || node.path}
          depth={0}
        />
      ) : null}
    </TreeContext.Provider>
  );
}

Tree.propTypes = {
  tree: PropTypes.array,
  defaultOpen: PropTypes.arrayOf(PropTypes.string),
  blobNodeComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  onExpand: PropTypes.func
};

export default Tree;
