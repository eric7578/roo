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
  nextInDepthNodeSelectorCreator
} from './makeTreeSelectors';

const SourceTree = props => {
  const rootNodesSelector = useCallback(rootNodesSelctorCreator(), []);
  const nextInDepthNodeSelector = useCallback(
    nextInDepthNodeSelectorCreator(),
    []
  );
  const rootNodes = useSelector(rootNodesSelector);
  const nextInDepthNode = useSelector(nextInDepthNodeSelector);
  const dispatch = useDispatch();

  const onClickNode = useCallback(node => {
    dispatch(sourceTreeNodeAction(node));
  }, []);

  useEffectOnce(() => {
    dispatch(getSourceTreeNodes());
  });

  useEffect(() => {
    if (nextInDepthNode) {
      dispatch(toggleNode(nextInDepthNode.fullPath, true));
      dispatch(getSourceTreeNodes(nextInDepthNode));
    }
  }, [nextInDepthNode]);

  return rootNodes.map(node => (
    <TreeNode node={node} key={node.fullPath} onClick={onClickNode} />
  ));
};

export default SourceTree;
