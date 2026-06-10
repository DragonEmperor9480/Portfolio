import { useState, lazy, Suspense } from 'react';
import styled from 'styled-components';
import { ReactLenis } from 'lenis/react';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider } from './context/ThemeContext';
import { PlayerProvider } from './context/PlayerContext';
import { AppsProvider, useApps } from './context/AppsContext';
import AppWindow from './components/apps/AppWindow';
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

// Lazy load heavy application components
const TerminalApp = lazy(() => import('./components/apps/TerminalApp'));
const SystemMonitorApp = lazy(() => import('./components/apps/SystemMonitorApp'));
const NotesApp = lazy(() => import('./components/apps/NotesApp'));
const MusicApp = lazy(() => import('./components/apps/MusicApp'));
const BrowserApp = lazy(() => import('./components/apps/BrowserApp'));

const APP_COMPONENTS = {
  terminal: TerminalApp,
  monitor: SystemMonitorApp,
  notes: NotesApp,
  music: MusicApp,
  browser: BrowserApp,
};

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px;
  gap: 16px;
  background: rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
`;

const SkeletonBar = styled.div`
  height: ${({ $height }) => $height || '20px'};
  width: ${({ $width }) => $width || '100%'};
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0.02) 25%, 
    rgba(255, 255, 255, 0.06) 50%, 
    rgba(255, 255, 255, 0.02) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
  border-radius: 6px;

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

function WindowSkeletonLoader() {
  return (
    <SkeletonContainer>
      <SkeletonBar $height="24px" $width="30%" />
      <SkeletonBar $height="140px" />
      <SkeletonBar $height="16px" $width="85%" />
      <SkeletonBar $height="16px" $width="60%" />
    </SkeletonContainer>
  );
}

function ActiveWindows() {
  const { runningApps } = useApps();

  return (
    <AnimatePresence>
      {runningApps.map((app, index) => {
        const Component = APP_COMPONENTS[app.id];
        if (!Component) return null;

        return (
          <AppWindow key={app.id} app={app} zIndex={100 + index}>
            <Suspense fallback={<WindowSkeletonLoader />}>
              <Component />
            </Suspense>
          </AppWindow>
        );
      })}
    </AnimatePresence>
  );
}

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
        <div className="system-screen-overlay" />
        <AnimatePresence>
          {isLoading ? (
            <SkeletonLoader onComplete={() => setIsLoading(false)} />
          ) : (
            <>
              <AppRoutes />
              <ActiveWindows />
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
      <AppsProvider>
        <PlayerProvider>
          <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
            <ThemedApp />
          </ReactLenis>
        </PlayerProvider>
      </AppsProvider>
    </ThemeProvider>
  );
}

export default App;
