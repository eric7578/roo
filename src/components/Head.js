import React, {useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import Tree from './Tree';
import {Renderer} from './WithRenderer';
import {Repository} from './WithRepository';
import useTree, {ROOT_SHA} from './hooks/useTree';

const Head = props => {
  const {state, expandTree, resetTree} = useTree();
  const {HeadNode} = useContext(Renderer);
  const {repo, params} = useContext(Repository);

  useEffect(() => {
    resetTree();
    repo.getNodes(props.head).then(tree => expandTree(ROOT_SHA, tree));
  }, [props.head]);

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
