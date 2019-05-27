import React, {useContext} from 'react';
import {DataSource} from '../../context';

const CommitNode = props => {
  const dataSource = useContext(DataSource);
  return (
    <>
      <a href={dataSource.getCommitNodePath(props, dataSource)}>
        {props.path}
      </a>
      <span>{`+${props.additions} -${props.deletions}`}</span>
    </>
  );
}

export default CommitNode;
