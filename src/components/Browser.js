import React, { useContext, useEffect, useCallback, useState } from 'react';
import { Context as BackendContext } from './Backend';
import Tree from './Tree';
import { TreeNode, DiffNode } from './TreeNodes';
import useTree from '../hooks/useTree';
import { BrowsingModes } from '../enum';

export default function Browser(props) {
  const { browsingMode, loadTree, loadDiff, params, navigate, navigateDiff } =
    useContext(BackendContext);
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

  const onNavigateDiff = useCallback(
    node => {
      navigateDiff(params, node);
    },
    [params]
  );

  useEffect(() => {
    if (browsingMode === BrowsingModes.TREE) {
      loadTree(params).then(nodes => {
        buildTree(nodes);
        if (params.path) {
          const path = params.path.split('/').slice(0, -1);
          for (let end = 1; end <= path.length; end++) {
            updateNode(path.slice(0, end), { open: true });
          }
        }
      });
    } else if (browsingMode === BrowsingModes.DIFF) {
      loadDiff(params).then(nodes => {
        buildTree(nodes, { open: true });
      });
    }
  }, [browsingMode]);

  useEffect(() => {
    setFocusPath(params.path);
  }, [params.path]);

  return (
    <Tree tree={tree} focusPath={focusPath}>
      {({ node }) => (
        <>
          {browsingMode === BrowsingModes.TREE && (
            <TreeNode node={node} onNavigate={onNavigate} onExpand={onExpand} />
          )}
          {browsingMode === BrowsingModes.DIFF && (
            <DiffNode
              node={node}
              onNavigate={onNavigateDiff}
              onExpand={onExpand}
            />
          )}
        </>
      )}
    </Tree>
  );
}
