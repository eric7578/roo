import React, {useContext, useCallback} from 'react';
import PropTypes from 'prop-types';
import {DataSource, Pjax} from '../../context';

const PjaxNode = props => {
  const dataSource = useContext(DataSource);
  const {pjaxTo} = useContext(Pjax);

  const href = dataSource.getHeadNodePath(props, dataSource);

  const onClick = useCallback(e => {
    if (e.ctrlKey || e.metaKey || e.shiftKey) {
      return;
    }

    e.preventDefault();
    pjaxTo(href).then(() => {
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

PjaxNode.propTypes = {
  onComplete: PropTypes.func
};

export default PjaxNode;
