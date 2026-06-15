'use client';

import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', sans-serif;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    transition: all 0.1s ease;
    position: relative;
    min-height: 100vh;
    overflow-x: hidden;
    width: 100%;
    margin: 0;
    padding: 0;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }

  /* Add smooth transitions for theme changes (avoid universal selector '*' for performance) */
  body, nav, section, button, a, p, h1, h2, h3, h4, h5, h6, input, textarea, select, span {
    transition: background-color 0.15s ease,
                color 0.15s ease,
                border-color 0.15s ease,
                box-shadow 0.15s ease;
  }

  /* Disable transitions on mobile/touch devices for smooth 60fps scrolling */
  @media (hover: none) and (pointer: coarse) {
    body, nav, section, button, a, p, h1, h2, h3, h4, h5, h6, input, textarea, select, span {
      transition: none !important;
    }
  }

  /* Ensure content appears above background */
  main, nav, header {
    position: relative;
    z-index: 1;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #000;
  }

  ::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 4px;
  }

  #root {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden;
  }

  html {
    max-width: 100vw;
  }

  body {
    overflow-x: hidden;
  }

  main {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1280px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
  }

  section {
    min-height: 100vh;
    padding-top: 70px;
    width: 100%;
    max-width: 1280px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    padding: 70px 20px;

    @media (max-width: 1024px) {
      padding: 60px 20px;
    }

    @media (max-width: 768px) {
      padding: 50px 15px;
      min-height: auto;
    }

    @media (max-width: 480px) {
      padding: 40px 10px;
    }
  }

  .system-screen-overlay {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 999999;
    background: black;
    opacity: var(--system-dimness, 0);
    transition: opacity 0.15s ease;
  }
`;

export default GlobalStyles;
