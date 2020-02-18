import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import context from './context';
import useEffectOnce from '../../hooks/useEffectOnce';
import {
  getSourceTreeNodes,
  toggleNode,
  navigateNode
} from '../../modules/tree';
import TreeNode from './TreeNode';
import { createRootNodesSelctor } from './makeTreeSelectors';
import { treeTypes } from '../../enum';

const selectRootNodes = createRootNodesSelctor(treeTypes.TREE);

const SourceTree = props => {
  const dispatch = useDispatch();
  const rootNodes = useSelector(selectRootNodes);

  const onClickNode = useCallback(
    node => {
      if (node.isFile) {
        dispatch(navigateNode(treeTypes.TREE, node.fullPath));
      } else {
        dispatch(toggleNode(treeTypes.TREE, node.fullPath));
      }
    },
    [dispatch]
  );

  useEffectOnce(() => {
    dispatch(getSourceTreeNodes());
  });

  return (
    <context.Provider value={treeTypes.TREE}>
      {rootNodes.map(node => (
        <TreeNode
          depth={0}
          key={node.fullPath}
          node={node}
          onClick={onClickNode}
        />
      ))}
    </context.Provider>
  );
};

export default SourceTree;
