import {useContext, useCallback} from 'react';
import document from 'global/document'
import {Repository} from '../../context';

export default function usePJAX(selector) {
  const {repo} = useContext(Repository);

  const pjax = useCallback(path => {
    repo.pjax(path).then(html => {
      const node = document.querySelector(selector);
      if (node) {
        node.innerHTML = html;
      }
    });
  }, [selector]);

  return pjax;
}
