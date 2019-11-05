import { useEffect } from 'react';

export default function usePathnameUpdate(callback) {
  useEffect(() => {
    const onMessage = message => {
      if (message.type === 'roo/locationChanged') {
        callback();
      }
    };
    chrome.runtime.onMessage.addListener(onMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(onMessage);
    };
  }, []);
}
