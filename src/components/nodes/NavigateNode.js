import React, {useContext, useCallback} from 'react';
import PropTypes from 'prop-types';
import {DataSource} from '../../context';

const NavigateNode = props => {
  const dataSource = useContext(DataSource);

  const href = dataSource.getHeadNodePath(props, dataSource);

  const onClick = useCallback(e => {
    if (e.ctrlKey || e.metaKey || e.shiftKey) {
      return;
    }

    e.preventDefault();
    dataSource.navigateTo(href).then(() => {
      if (props.onComplete) {
        props.onComplete();
      }
    });
  }, [href]);

  return (
    <a
      className={props.className}
      onClick={onClick}
      href={href}
    >
      {props.children}
    </a>
  );
}

NavigateNode.propTypes = {
  onComplete: PropTypes.func
};

export default NavigateNode;
