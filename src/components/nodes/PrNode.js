import React, {useContext} from 'react';
import {DataSource} from '../../context';
import Pjax from '../Pjax';

const PrNode = props => {
  const dataSource = useContext(DataSource);
  return (
    <>
      <Pjax to={dataSource.getPrNodePath(props, dataSource)}>{props.path}</Pjax>
      <span>{`+${props.additions} -${props.deletions}`}</span>
    </>
  );
}

export default PrNode;
