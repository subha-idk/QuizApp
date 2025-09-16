import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    background-color: ${({ theme }) => theme.colors.grayLight};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.join(', ')};
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* Prevents the pull-to-refresh action on mobile, giving a more native feel */
    overscroll-behavior-y: contain;
  }

  #root {
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* Add padding to the bottom of the body to prevent content from being hidden by the nav bar */
  body {
    padding-bottom: 80px;
  }
`;
