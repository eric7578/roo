import React, {useContext} from 'react';
import Diff from './Diff';
import {DataSource} from '../../context';

const CommitNode = props => {
  const dataSource = useContext(DataSource);
  return (
    <div>
      <a href={dataSource.getCommitNodePath(props, dataSource)}>
        {props.path}
      </a>
      <Diff additions={props.additions} deletions={props.deletions} />
    </div>
  );
}

export default CommitNode;
