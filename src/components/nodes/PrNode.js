import React, {useContext} from 'react';
import Diff from './Diff';
import {DataSource} from '../../context';

const PrNode = props => {
  const dataSource = useContext(DataSource);
  return (
    <div>
      <a href={dataSource.getPrNodePath(props, dataSource)}>{props.path}</a>
      <Diff additions={props.additions} deletions={props.deletions} />
    </div>
  );
}

export default PrNode;
