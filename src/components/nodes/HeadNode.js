import React, {useContext} from 'react';
import {DataSource} from '../../context';
import Pjax from '../Pjax';

const HeadNode = props => {
  const dataSource = useContext(DataSource);
  return (
    <Pjax to={dataSource.getHeadNodePath(props, dataSource)}>
      {props.children}
    </Pjax>
  );
}

export default HeadNode;
