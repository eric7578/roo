import React, {createElement, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Toggleable from './Toggleable';
import {ROOT_SHA} from './hooks/useTree';

const NodeList = styled.ol`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const NodeItem = styled.li`
  cursor: pointer;
  margin-left: 15px;
`;

const Tree = props => {
  const {blobNodeComponent, onExpandTree, ...blobNodeProps} = props;
  const isRoot = props.sha === ROOT_SHA;
  const [isOpen, setIsOpen] = useState(isRoot);

  const onClick = e => {
    if (e.target === e.currentTarget) {
      setIsOpen(!isOpen);
      if (!isOpen && props.type === 'tree' && onExpandTree) {
        onExpandTree(props.sha);
      }
    }
  }

  return (
    <div onClick={props.type === 'tree' ? onClick : undefined}>
      {props.type === 'blob' && createElement(blobNodeComponent, blobNodeProps)}
      {props.type === 'tree' && !isRoot &&
        <>
          <FontAwesomeIcon icon={isOpen ? 'folder-open' : 'folder'} />
          {props.path}
        </>
      }
      {props.type === 'tree' &&
        <Toggleable isOpen={isOpen}>
          {props.tree && props.tree.length > 0 &&
            <NodeList>
              {props.tree.map(node =>
                <NodeItem key={node.sha || node.path}>
                  <Tree
                    {...node}
                    blobNodeComponent={blobNodeComponent}
                    prevTrees={isRoot
                      ? []
                      : [...props.prevTrees, props.path]
                    }
                    onExpandTree={node.type === 'tree'
                      ? props.onExpandTree
                      : undefined
                    }
                  />
                </NodeItem>
              )}
            </NodeList>
          }
        </Toggleable>
      }
    </div>
  );
}

const NodePropTypes = {
  sha: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.symbol
  ]),
  type: PropTypes.oneOf(['blob', 'tree']).isRequired,
  path: PropTypes.string
};

Tree.propTypes = {
  ...NodePropTypes,
  tree: PropTypes.arrayOf(PropTypes.shape(NodePropTypes)),
  prevTrees: PropTypes.arrayOf(PropTypes.string),
  blobNodeComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]).isRequired,
  onExpandTree: PropTypes.func
};

export default Tree;
