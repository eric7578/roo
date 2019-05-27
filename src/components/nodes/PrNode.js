import React, {useContext} from 'react';
import {DataSource} from '../../context';

const PrNode = props => {
  const dataSource = useContext(DataSource);
  return (
    <>
      <a href={dataSource.getPrNodePath(props, dataSource)}>{props.path}</a>
      <span>{`+${props.additions} -${props.deletions}`}</span>
    </>
  );
}

export default PrNode;
