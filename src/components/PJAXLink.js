import React from 'react';

const PJAXLink = props => {
  const onClick = e => {
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }

    e.preventDefault();
    window.history.pushState(null, '', props.href);
  }

  return <a {...props} onClick={onClick} />;
}

export default PJAXLink;
