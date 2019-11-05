import React, { useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import TreeNode from './TreeNode';
import useTree from '../../hooks/useTree2';
import { TREE } from '../../types/TreeNodeTypes';

export const Context = React.createContext();

function sortNodes(n1, n2) {
  if (n1.type === 'tree' && n2.type !== 'tree') {
    return -1;
  } else if (n1.path < n2.path) {
    return -1;
  }
  return 0;
}

const Tree = ({ nodes, onNavigate, onExpand }) => {
  const { state, toggle, append, initialize } = useTree(nodes);
  useEffect(() => initialize(nodes), [nodes]);

  const rootNodes = useMemo(() => {
    return Array.from(state.entries()).filter(
      ([absPath, node]) => absPath === node.path
    );
  }, [state]);

  const onToggle = useCallback(
    async absPath => {
      const node = state.get(absPath);
      toggle(node);

      if (node.type === TREE && node.tree.size === 0) {
        await onExpand(node);
        // append
      }
    },
    [state, onExpand]
  );

  return (
    <Context.Provider value={state}>
      {rootNodes.map(node => (
        <TreeNode key={node.path} absPath={node.path} onToggle={onToggle} />
      ))}
    </Context.Provider>
  );
};

Tree.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.string),
  onNavigate: PropTypes.func,
  onExpand: PropTypes.func
};

export default Tree;
