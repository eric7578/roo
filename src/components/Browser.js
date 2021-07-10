import React, { useContext, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { BrowsingModes } from '../enum';
import { Context as BackendContext } from './Backend';
import Tree from './Tree';
import useTree from '../hooks/useTree';

const Wrapper = styled.div`
  display: ${props => (props.visible ? 'block' : 'none')};
  height: 100vh;
  overflow: scroll;
`;

export default function Browser({ visible }) {
  const { browsingMode, loadTree, params, ...rest } =
    useContext(BackendContext);
  const [tree, { buildTree, updateNode }] = useTree();

  const onExpand = useCallback(node => {
    updateNode(node.path, { open: !node.open });
  }, []);

  useEffect(() => {
    loadTree(params).then(nodes => buildTree(nodes));
  }, [params]);

  return (
    <Wrapper visible={visible}>
      <Tree tree={tree} onExpand={onExpand} />
    </Wrapper>
  );
}

Browser.propTypes = {
  visible: PropTypes.bool
};
