import React, { useContext, useEffect, useCallback } from 'react';
import { Context as BackendContext } from './Backend';
import Tree from './Tree';
import useTree from '../hooks/useTree';

export default function Browser(props) {
  const { loadTree, params, navigate } = useContext(BackendContext);
  const [tree, { buildTree, updateNode }] = useTree();

  const onExpand = useCallback(node => {
    updateNode(node.path, { open: !node.open });
  }, []);

  const onNavigate = useCallback(
    node => {
      navigate(params, node);
    },
    [params]
  );

  useEffect(() => {
    loadTree(params).then(nodes => buildTree(nodes));
  }, [params]);

  return <Tree tree={tree} onExpand={onExpand} onNavigate={onNavigate} />;
}
