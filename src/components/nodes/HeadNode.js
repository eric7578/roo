import React, {useContext, useCallback} from 'react';
import {DataSource, Pjax} from '../../context';

const HeadNode = props => {
  const dataSource = useContext(DataSource);
  const {pjaxTo} = useContext(Pjax);

  const href = dataSource.getHeadNodePath(props, dataSource);

  const onClick = useCallback(e => {
    if (e.ctrlKey || e.metaKey || e.shiftKey) {
      return;
    }

    e.preventDefault();
    pjaxTo(href);
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

export default HeadNode;
