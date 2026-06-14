'use client';

/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useCallback } from 'react';

const AppsContext = createContext(null);

export const APPS = {
  terminal: {
    id: 'terminal',
    title: 'Cyber Terminal',
    icon: 'fas fa-terminal',
    defaultWidth: 800,
    defaultHeight: 500,
  },
  monitor: {
    id: 'monitor',
    title: 'System Diagnostics',
    icon: 'fas fa-chart-line',
    defaultWidth: 780,
    defaultHeight: 520,
  },
  notes: {
    id: 'notes',
    title: 'Secure Logs Notepad',
    icon: 'fas fa-sticky-note',
    defaultWidth: 680,
    defaultHeight: 500,
  },
  music: {
    id: 'music',
    title: 'YouTube Media Console',
    icon: 'fas fa-music',
    defaultWidth: 680,
    defaultHeight: 520,
  },
  browser: {
    id: 'browser',
    title: 'Web Sandbox',
    icon: 'fas fa-globe',
    defaultWidth: 980,
    defaultHeight: 620,
  },
  hackerhub: {
    id: 'hackerhub',
    title: 'HackerHub',
    icon: 'fas fa-user-secret',
    defaultWidth: 780,
    defaultHeight: 500,
  }
};

export function AppsProvider({ children }) {
  const [runningApps, setRunningApps] = useState([]);
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);

  const focusApp = useCallback((id) => {
    setRunningApps((prev) => {
      const app = prev.find((a) => a.id === id);
      if (!app) return prev;
      // Filter out the focused app and append it to the end of the array (giving it the highest z-index/render stack order)
      const remaining = prev.filter((a) => a.id !== id);
      return [...remaining, { ...app, isMinimized: false }];
    });
  }, []);

  const launchApp = useCallback((id) => {
    const appConfig = APPS[id];
    if (!appConfig) return;

    setRunningApps((prev) => {
      const alreadyRunning = prev.find((a) => a.id === id);
      if (alreadyRunning) {
        // If already running, focus and unminimize
        setTimeout(() => focusApp(id), 0);
        return prev;
      }

      // Calculate sizes bounded by viewport boundaries
      const w = Math.min(appConfig.defaultWidth, window.innerWidth - 40);
      const h = Math.min(appConfig.defaultHeight, window.innerHeight - 80);

      const centerX = (window.innerWidth - w) / 2;
      const centerY = (window.innerHeight - h) / 2;

      // Cascading offset to avoid complete overlap of centered windows
      const offset = 24;
      const count = prev.length;
      const initialX = Math.max(20, centerX + (count * offset) % 120);
      const initialY = Math.max(20, centerY + (count * offset) % 120);

      const newApp = {
        ...appConfig,
        isMaximized: false,
        isMinimized: false,
        x: initialX,
        y: initialY,
        width: w,
        height: h,
      };

      return [...prev, newApp];
    });

    setIsLauncherOpen(false);
  }, [focusApp]);

  const closeApp = useCallback((id) => {
    setRunningApps((prev) => prev.filter((app) => app.id !== id));
  }, []);

  const toggleMaximize = useCallback((id) => {
    setRunningApps((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, isMaximized: !app.isMaximized } : app
      )
    );
  }, []);

  const toggleMinimize = useCallback((id) => {
    setRunningApps((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, isMinimized: !app.isMinimized } : app
      )
    );
  }, []);

  const updateWindowPosition = useCallback((id, x, y) => {
    setRunningApps((prev) =>
      prev.map((app) => (app.id === id ? { ...app, x, y } : app))
    );
  }, []);

  const updateWindowSize = useCallback((id, width, height) => {
    setRunningApps((prev) =>
      prev.map((app) => (app.id === id ? { ...app, width, height } : app))
    );
  }, []);

  const openLauncher = useCallback(() => setIsLauncherOpen(true), []);
  const closeLauncher = useCallback(() => setIsLauncherOpen(false), []);
  const toggleLauncher = useCallback(() => setIsLauncherOpen((prev) => !prev), []);

  return (
    <AppsContext.Provider
      value={{
        runningApps,
        isLauncherOpen,
        launchApp,
        closeApp,
        focusApp,
        toggleMaximize,
        toggleMinimize,
        updateWindowPosition,
        updateWindowSize,
        openLauncher,
        closeLauncher,
        toggleLauncher,
      }}
    >
      {children}
    </AppsContext.Provider>
  );
}

export function useApps() {
  const context = useContext(AppsContext);
  if (!context) {
    throw new Error('useApps must be used within an AppsProvider');
  }
  return context;
}
