import { useState, useEffect } from 'react';
import { parse } from 'url';

export default function useBrowserURL() {
  const [url, setUrl] = useState(() => parse(window.location.href));

  useEffect(() => {
    const onMessage = message => {
      if (message.type === 'roo/locationChanged') {
        const url = parse(window.location.href);
        setUrl(url);
      }
    };
    chrome.runtime.onMessage.addListener(onMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(onMessage);
    };
  }, []);

  return url;
}
