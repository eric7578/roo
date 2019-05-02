import { useEffect } from 'react';

export default function useLocationEffect(changed) {
  const onMessage = message => {
    switch (message.type) {
      case 'roo/locationChanged':
        changed();
      default:
        return;
    }
  }

  useEffect(() => {
    changed();
    chrome.runtime.onMessage.addListener(onMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(onMessage);
    }
  }, []);
}

