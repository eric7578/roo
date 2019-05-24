import React, {useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import window from 'global/window';
import Tree from './Tree';
import {Renderer, Repository} from '../context';
import useTree, {ROOT_SHA} from '../hooks/useTree';
import useDerivedState from '../hooks/useDerivedState';
import usePJAX from '../hooks/usePJAX';

const Head = props => {
  const {state, expandTree, resetTree} = useTree();
  const {HeadNode} = useContext(Renderer);
  const {repo, params} = useContext(Repository);

  useEffect(() => {
    resetTree();
    repo.getNodes(props.head).then(tree => expandTree(ROOT_SHA, tree));
  }, [props.head]);

  const pjax = usePJAX('main');
  useDerivedState(() => pjax(window.location.href), params._);

  return (
    <Tree
      tree={state.tree}
      defaultOpen={params._ && params._.split('/')}
      blobNodeComponent={HeadNode}
      onExpand={sha => {
        repo.getNodes(sha).then(tree => expandTree(sha, tree));
      }}
    />
  );
}

Head.propTypes = {
  head: PropTypes.string.isRequired
};

export default Head;
