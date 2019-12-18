import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useEffectOnce from '../../hooks/useEffectOnce';
import {
  sourceTreeNodeAction,
  getSourceTreeNodes,
  toggleNode
} from '../../modules/tree';
import TreeNode from './TreeNode';
import {
  rootNodesSelctorCreator,
  nextPrefetchNodeSelectorCreator
} from './makeTreeSelectors';

const SourceTree = props => {
  const rootNodesSelector = useCallback(rootNodesSelctorCreator(), []);
  const nextPrefetchNodeSelector = useCallback(
    nextPrefetchNodeSelectorCreator(),
    []
  );
  const rootNodes = useSelector(rootNodesSelector);
  const nextPrefetchNode = useSelector(nextPrefetchNodeSelector);
  const dispatch = useDispatch();

  const onClickNode = useCallback(node => {
    dispatch(sourceTreeNodeAction(node));
  }, []);

  useEffectOnce(() => {
    dispatch(getSourceTreeNodes());
  });

  useEffect(() => {
    if (nextPrefetchNode) {
      dispatch(toggleNode(nextPrefetchNode.fullPath, true));
      dispatch(getSourceTreeNodes(nextPrefetchNode));
    }
  }, [nextPrefetchNode]);

  return rootNodes.map(node => (
    <TreeNode node={node} key={node.fullPath} onClick={onClickNode} />
  ));
};

export default SourceTree;
