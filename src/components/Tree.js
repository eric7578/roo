import React, {createElement, createContext, useContext, useState, useMemo, useEffect} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Toggleable from './Toggleable';
import useDerivedState from './hooks/useDerivedState';

const TreeContext = createContext();

const NodeList = styled.ol`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const NodeItem = styled.li`
  cursor: pointer;
  margin-left: 15px;
`;

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
    if (isOpen && onExpand) {
      onExpand(props.sha);
    }
  }, isOpen);

  const onToggleOpen = e => {
    if (e.target === e.currentTarget) {
      setIsOpen(!isOpen);
    }
  }

  return (
    <div onClick={isTree ? onToggleOpen : undefined}>
      {isBlob && createElement(blobNodeComponent, props)}
      {isTree &&
        <>
          <FontAwesomeIcon icon={isOpen ? 'folder-open' : 'folder'} />
          {props.path}
          <Toggleable isOpen={isOpen}>
            {props.tree && props.tree.length > 0 &&
              <NodeList>
                {props.tree.map(node => {
                  return (
                    <NodeItem key={node.sha || node.path}>
                      <TreeNode
                        {...node}
                        parentPath={nextLevelParentPath}
                        open={open}
                        blobNodeComponent={blobNodeComponent}
                        depth={props.depth + 1}
                        defaultOpen={props.defaultOpen}
                        onExpand={props.onExpand}
                      />
                    </NodeItem>
                  );
                })}
              </NodeList>
            }
          </Toggleable>
        </>
      }
    </div>
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
