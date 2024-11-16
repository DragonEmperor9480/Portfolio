import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider } from './context/ThemeContext';
import { themes } from './themes/themes';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/sections/About';
import DevBackground from './components/DevBackground';
import { useTheme } from './context/ThemeContext';
import GlobalStyles from './styles/GlobalStyles';
import Certifications from './components/sections/Certifications';
import Achievements from './components/sections/Achievements';
import SkeletonLoader from './components/SkeletonLoader';

function ThemedApp() {
  const { currentTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <StyledThemeProvider theme={themes[currentTheme]}>
      <Router>
        <GlobalStyles />
        <AnimatePresence>
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <>
              <DevBackground />
              <Navbar />
              <main>
                <Hero />
                <About />
                <Achievements />
                <Certifications />
              </main>
            </>
          )}
        </AnimatePresence>
      </Router>
    </StyledThemeProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

export default App;
