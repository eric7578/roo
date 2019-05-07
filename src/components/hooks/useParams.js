import {useState, useEffect} from 'react';
import UrlPattern from 'url-pattern';

export default function useParams(patterns) {
  const [params, setParams] = useState(() => parseParams(patterns));

  const onMessage = message => {
    if (message.type === 'roo/locationChanged') {
      setParams(parseParams(patterns));
    }
  }

  useEffect(() => {
    chrome.runtime.onMessage.addListener(onMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(onMessage);
    }
  }, []);

  return params;
}

function parseParams(patterns) {
  const {href} = window.location;
  const hashIndex = window.location.href.lastIndexOf('#');
  const url = hashIndex < 0 ? href : href.slice(0, hashIndex);

  for (const pattern of patterns) {
    const urlPattern = new UrlPattern(pattern, {
      segmentValueCharset: 'a-zA-Z0-9-_~ %.'
    });
    const params = urlPattern.match(url);
    if (params) {
      return params;
    }
  }
  return {};
}
