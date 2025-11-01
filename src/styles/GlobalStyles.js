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
    transition: all 0.3s ease;
    position: relative;
    min-height: 100vh;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin: 0;
    padding: 0;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    cursor: none;

    @media (max-width: 768px) {
      cursor: auto;
    }
  }

  * {
    cursor: none;

    @media (max-width: 768px) {
      cursor: auto;
    }
  }

  a, button {
    cursor: none !important;

    @media (max-width: 768px) {
      cursor: pointer !important;
    }
  }

  /* Add smooth transitions for theme changes */
  * {
    transition: background-color 0.3s ease,
                color 0.3s ease,
                border-color 0.3s ease,
                box-shadow 0.3s ease;
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
  }

  html {
    scroll-behavior: smooth;
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
`;

export default GlobalStyles;
