import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Toggleable from './Toggleable';
import { Repository } from './WithRepository';

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

const Tree = props => {
  const { renderer: { BlobNode } } = useContext(Repository);
  const [isOpen, setIsOpen] = useState(props.root);

  useEffect(() => {
    if (isOpen && props.type === 'tree') {
      props.onExpandTree(props.sha);
    }
  }, [isOpen]);

  const onClick = e => {
    if (e.target === e.currentTarget) {
      setIsOpen(!isOpen);
    }
  }

  const navigateBlobPage = e => {
    e.preventDefault();
    window.location =  e.target.href;
  }

  return (
    <div onClick={props.type === 'tree' ? onClick : undefined}>
      {props.type === 'blob' &&
        <>
          <FileIcon icon='file' />
          {props.path}
        </>
      }
      {props.type === 'tree' && !props.root &&
        <>
          <FileIcon icon={isOpen ? 'folder-open' : 'folder'} />
          {props.path}
        </>
      }
      {props.type === 'tree' &&
        <Toggleable isOpen={isOpen}>
          {props.tree && props.tree.length > 0 &&
            <NodeList>
              {props.tree.map(node =>
                <NodeItem key={`${node.sha}_${node.path}`}>
                  <Tree
                    {...node}
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
  sha: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['blob', 'tree']).isRequired
};

Tree.propTypes = {
  ...NodePropTypes,
  root: PropTypes.bool,
  tree: PropTypes.arrayOf(PropTypes.shape(NodePropTypes)),
  onExpandTree: PropTypes.func
};

Tree.defaultProps = {
  root: false
};

export default Tree;
