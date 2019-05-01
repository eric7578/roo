import { useState, useEffect } from 'react';
import document from 'global/document';
import window from 'global/window';

export default function useDetectedTheme(defaultTheme = {}) {
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    const bodyStyle = window.getComputedStyle(document.body);
    setTheme({
      backgroundColor: bodyStyle.backgroundColor,
      color: bodyStyle.color
    });
  }, []);

  return theme;
}
