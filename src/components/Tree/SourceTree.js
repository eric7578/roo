import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useEffectOnce from '../../hooks/useEffectOnce';
import { sourceTreeNodeAction, getSourceTreeNodes } from '../../modules/tree';
import TreeNode from './TreeNode';
import { rootNodesSelctorCreator } from './makeTreeSelectors';

const SourceTree = props => {
  const rootNodesSelector = useCallback(rootNodesSelctorCreator(), []);
  const rootNodes = useSelector(rootNodesSelector);
  const dispatch = useDispatch();

  const onClickNode = useCallback(node => {
    dispatch(sourceTreeNodeAction(node));
  }, []);

  useEffectOnce(() => {
    dispatch(getSourceTreeNodes());
  });

  return rootNodes.map(node => (
    <TreeNode node={node} key={node.fullPath} onClick={onClickNode} />
  ));
};

export default SourceTree;
