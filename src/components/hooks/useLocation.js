import { useEffect } from 'react';

export default function useLocation(changed) {
  const onMessage = message => {
    switch (message.type) {
      case 'roo/locationChanged':
        changed(message.url);
      default:
        return;
    }
  }

  useEffect(() => {
    chrome.runtime.onMessage.addListener(onMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(onMessage);
    }
  }, []);
}

