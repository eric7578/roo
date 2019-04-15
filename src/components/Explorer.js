import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import document from 'global/document';
import window from 'global/window';

const Wrapper = styled.div`
  background-color: ${props => props.theme.backgroundColor};
  color: ${props => props.theme.color};
  height: 100vh;
  left: 0;
  overflow: auto;
  position: fixed;
  top: 0;
`;

const Explorer = props => {
  const [theme, setTheme] = useState({});

  useEffect(() => {
    const bodyStyle = window.getComputedStyle(document.body);
    setTheme({
      backgroundColor: bodyStyle.backgroundColor,
      color: bodyStyle.color
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        {props.children}
      </Wrapper>
    </ThemeProvider>
  );
}

Explorer.propTypes = {
  children: PropTypes.node
};

export default Explorer;
