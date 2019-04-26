import React, { Fragment, memo, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Repository } from './WithRepository';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Toggleable from './Toggleable';

const NodeList = styled.ol`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const NodeItem = styled.li`
  cursor: pointer;
  margin-left: 15px;
`;

const FileIcon = styled(FontAwesomeIcon).attrs({
  style: {
    marginRight: 5
  }
})``;

const sortNodes = (n1, n2) => {
  return n1.type === 'tree' && n2.type !== 'tree' ? -1 : 1;
}

const Tree = props => {
  const { renderer: { BlobNode } } = useContext(Repository);
  const [tree, setTree] = useState(null);
  const [isOpen, setIsOpen] = useState(!props.type);

  const onClick = e => {
    if (e.target === e.currentTarget) {
      const nextIsOpen = !isOpen;
      setIsOpen(!isOpen);

      if (nextIsOpen && !tree) {
        loadTree();
      }
    }
  }

  const loadTree = () => {
    props.getNodes(props.sha).then(nodes => {
      nodes.sort(sortNodes);
      setTree(nodes);
    });
  }

  const changeLocation = e => {
    e.preventDefault();
    window.location =  e.target.href;
  }

  useEffect(() => {
    if (isOpen) {
      loadTree();
    }
  }, []);

  return (
    <div onClick={props.type === 'tree' ? onClick : undefined}>
      {props.type === 'tree' &&
        <>
          <FileIcon icon={isOpen ? 'folder-open' : 'folder'} />
          {props.path}
        </>
      }
      {props.type === 'blob' &&
        <BlobNode
          parentPath={props.parentPath}
          onClick={changeLocation}
        >
          <FileIcon icon='file' />
          {props.path}
        </BlobNode>
      }
      <Toggleable isOpen={isOpen}>
        <NodeList>
          {tree && tree.map(node =>
            <NodeItem key={`${node.sha}_${node.path}`}>
              <Tree
                {...node}
                parentPath={[
                  ...props.parentPath,
                  node.path
                ]}
                getNodes={node.type === 'tree'
                  ? props.getNodes
                  : undefined
                }
              />
            </NodeItem>
          )}
        </NodeList>
      </Toggleable>
    </div>
  );
};

Tree.propTypes = {
  sha: PropTypes.string.isRequired,
  parentPath: PropTypes.arrayOf(PropTypes.string),
  path: PropTypes.string,
  type: PropTypes.oneOf(['blob', 'tree']),
  getNodes: PropTypes.func
};

Tree.defaultProps = {
  parentPath: []
};

export default memo(Tree);
