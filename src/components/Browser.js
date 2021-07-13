import React, { useContext, useEffect, useCallback, useState } from 'react';
import { Context as BackendContext } from './Backend';
import Tree from './Tree';
import useTree from '../hooks/useTree';

export default function Browser(props) {
  const { loadTree, params, navigate } = useContext(BackendContext);
  const [tree, { buildTree, updateNode }] = useTree();
  const [focusPath, setFocusPath] = useState('');

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
    loadTree(params).then(nodes => {
      buildTree(nodes);
      if (params.path) {
        const path = params.path.split('/').slice(0, -1);
        for (let end = 1; end <= path.length; end++) {
          updateNode(path.slice(0, end), { open: true });
        }
      }
    });
  }, []);

  useEffect(() => {
    setFocusPath(params.path);
  }, [params.path]);

  return (
    <Tree
      tree={tree}
      focusPath={focusPath}
      onExpand={onExpand}
      onNavigate={onNavigate}
    />
  );
}
