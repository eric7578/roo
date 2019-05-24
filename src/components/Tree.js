import React, {createElement, createContext, useContext, useState, useMemo, useEffect} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import icons from 'file-icons-js';
import Toggleable from './Toggleable';
import useDerivedState from './hooks/useDerivedState';
import {Folder, FolderOpen, UnknownFile} from './icons';
import 'file-icons-js/css/style.css';

const ChildTree = styled.ul`
  list-style-type: none;
  margin: 0 0 0 15px;
  padding: 0;
`;

const NodePath = styled.div`
  align-items: center;
  display: flex;
  color: #fafafa;
  cursor: pointer;

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

const FileNode = props => {
  const iconClass = icons.getClassWithColor(props.path);
  return (
    <NodePath>
      {iconClass ? <KnownFile className={iconClass} /> : <UnknownFile style={{width: 18, marginLeft: -3}} />}
      {props.path}
    </NodePath>
  );
}

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
        children: <FileNode path={props.path} />
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
                    <li key={node.sha ? `${node.path}_${node.sha}` : node.path}>
                      <TreeNode
                        {...node}
                        parentPath={nextLevelParentPath}
                        open={open}
                        blobNodeComponent={blobNodeComponent}
                        depth={props.depth + 1}
                        defaultOpen={props.defaultOpen}
                        onExpand={props.onExpand}
                      />
                    </li>
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
