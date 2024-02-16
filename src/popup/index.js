import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { StyledEngineProvider, CssVarsProvider } from '@mui/joy/styles';
import '@fontsource/inter';

createRoot(document.querySelector('#root')).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <CssVarsProvider></CssVarsProvider>
    </StyledEngineProvider>
  </StrictMode>,
);
