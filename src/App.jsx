import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import AmrutLab from './components/AmrutLab';

function HomePage() {
  return (
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
  );
}

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/AmrutLab" element={<AmrutLab />} />
      </Routes>
    </AnimatePresence>
  );
}

function ThemedApp() {
  const { currentTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <StyledThemeProvider theme={themes[currentTheme]}>
      <Router>
        <GlobalStyles />
        <AnimatePresence>
          {isLoading ? (
            <SkeletonLoader onComplete={() => setIsLoading(false)} />
          ) : (
            <AppRoutes />
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
