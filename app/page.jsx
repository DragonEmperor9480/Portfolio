'use client';

import { useState, lazy, Suspense } from 'react';
import styled from 'styled-components';
import { ReactLenis } from 'lenis/react';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider } from '../src/context/ThemeContext';
import { PlayerProvider } from '../src/context/PlayerContext';
import { AppsProvider, useApps } from '../src/context/AppsContext';
import AppWindow from '../src/components/apps/AppWindow';
import { themes } from '../src/themes/themes';
import Navbar from '../src/components/Navbar';
import Hero from '../src/components/Hero';
import About from '../src/components/sections/About';
import DevBackground from '../src/components/DevBackground';
import { useTheme } from '../src/context/ThemeContext';
import GlobalStyles from '../src/styles/GlobalStyles';
import Certifications from '../src/components/sections/Certifications';
import Achievements from '../src/components/sections/Achievements';
import SkeletonLoader from '../src/components/SkeletonLoader';

// Lazy load heavy application components
const TerminalApp = lazy(() => import('../src/components/apps/TerminalApp'));
const SystemMonitorApp = lazy(() => import('../src/components/apps/SystemMonitorApp'));
const NotesApp = lazy(() => import('../src/components/apps/NotesApp'));
const MusicApp = lazy(() => import('../src/components/apps/MusicApp'));
const BrowserApp = lazy(() => import('../src/components/apps/BrowserApp'));
const HackingHUD = lazy(() => import('../src/components/HackingHUD'));

const APP_COMPONENTS = {
  terminal: TerminalApp,
  monitor: SystemMonitorApp,
  notes: NotesApp,
  music: MusicApp,
  browser: BrowserApp,
  hackerhub: HackingHUD,
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
  background: linear-gradient(
    90deg,
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
  const { runningApps, closeApp } = useApps();
  const { setCurrentTheme } = useTheme();

  return (
    <AnimatePresence>
      {runningApps.map((app, index) => {
        const Component = APP_COMPONENTS[app.id];
        if (!Component) return null;

        if (app.id === 'hackerhub') {
          return (
            <Suspense key={app.id} fallback={null}>
              <Component
                onClose={() => closeApp('hackerhub')}
                onOverrideSuccess={() => {
                  setCurrentTheme('matrix');
                  closeApp('hackerhub');
                }}
              />
            </Suspense>
          );
        }

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

function ThemedApp() {
  const { currentTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <StyledThemeProvider theme={themes[currentTheme]}>
      <GlobalStyles />
      <div className="system-screen-overlay" />
      <AnimatePresence>
        {isLoading ? (
          <SkeletonLoader onComplete={() => setIsLoading(false)} />
        ) : (
          <>
            <HomePage />
            <ActiveWindows />
          </>
        )}
      </AnimatePresence>
    </StyledThemeProvider>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <AppsProvider>
        <PlayerProvider>
          <ReactLenis root options={{ lerp: 0.08, smoothWheel: true, syncTouch: true, touchMultiplier: 2, syncTouchLerp: 0.1 }}>
            <ThemedApp />
          </ReactLenis>
        </PlayerProvider>
      </AppsProvider>
    </ThemeProvider>
  );
}
