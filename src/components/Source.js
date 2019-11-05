import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Tree from './Tree';
import useTree, { ROOT_SHA } from '../hooks/useTree2';
import useDataSource from '../hooks/useDataSource';
import * as TabTypes from '../types/TabTypes';

const SourceNode = props => {
  const dataSource = useDataSource();
  const onClick = useCallback(
    e => {
      dataSource.onNavigate(TabTypes.SOURCE, props.parentPath, props.path);
    },
    [dataSource]
  );

  return <div onClick={onClick}>{props.children}</div>;
};

const Source = props => {
  const { state, expandTree, resetTree } = useTree();
  const dataSource = useDataSource();

  const onExpand = useCallback(
    async sha => {
      const tree = await dataSource.onGetNodes(sha);
      expandTree(sha, tree);
    },
    [dataSource, expandTree]
  );

  useEffect(() => {
    const initialize = async () => {
      const tree = await dataSource.onGetNodes();
      resetTree();
      expandTree(ROOT_SHA, tree);
    };
    initialize();
  }, [props.head]);

  return (
    <Tree
      tree={state.tree}
      defaultOpen={false}
      blobNodeComponent={SourceNode}
      onExpand={onExpand}
    />
  );
};

Source.propTypes = {
  head: PropTypes.string.isRequired
};

export default Source;
