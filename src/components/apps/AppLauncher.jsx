'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useApps } from '../../context/AppsContext';

const LauncherButton = styled(motion.button)`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.primary}30;
  color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.text};
  height: 40px;
  padding: 0 16px;
  margin-left: 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 0.85rem;
  font-weight: 600;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 12px ${({ theme }) => theme.colors.primary}50;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const PulseRing = styled(motion.span)`
  position: absolute;
  inset: -1px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  pointer-events: none;
`;

const FullscreenOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => {
    const bg = theme.colors.background || '#0c0c0e';
    if (bg === '#000000') return 'rgba(0, 0, 0, 0.45)';
    return 'rgba(10, 10, 15, 0.35)'; // Darken viewport background to isolate glass card
  }};
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
`;

const WindowContainer = styled(motion.div)`
  width: 850px;
  max-width: 95vw;
  background: ${({ theme }) => {
    const glass = theme.colors.glass || 'rgba(17, 17, 20, 0.75)';
    if (typeof glass === 'string' && glass.startsWith('rgba')) {
      // Light transparency adjustment (0.28) for high visual depth
      return glass.replace(/,\s*0\.\d+\s*\)$/, ', 0.28)');
    }
    return 'rgba(17, 17, 20, 0.28)';
  }};
  backdrop-filter: blur(32px) saturate(220%);
  -webkit-backdrop-filter: blur(32px) saturate(220%);
  border: 1px solid ${({ theme }) => {
    const isLight = theme.colors.background === '#f5f5f5';
    return isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.15)';
  }};
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 
    0 40px 100px rgba(0, 0, 0, 0.65),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
  transition: border-color 0.3s ease, background 0.3s ease;
`;

const TitleBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 28px;
  border-bottom: ${({ $minimized, theme }) => $minimized ? 'none' : `1px solid ${theme.colors.border || 'rgba(255, 255, 255, 0.05)'}`};
  transition: border-color 0.3s ease;
`;

const TrafficLights = styled.div`
  display: flex;
  gap: 8px;
`;

const LightButton = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  cursor: pointer;
  opacity: 0.85;
  transition: opacity 0.2s ease, transform 0.1s ease;

  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.9);
  }
`;

const WindowTitle = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary || 'rgba(255, 255, 255, 0.35)'};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-family: 'IBM Plex Mono', monospace;
  user-select: none;
  opacity: 0.7;
`;

const BodyContainer = styled(motion.div)`
  overflow-y: auto;
  max-height: 70vh;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary}30;
    border-radius: 2px;
  }
`;

const AppGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 240px);
  gap: 20px;
  padding: 44px 36px 48px;
  justify-content: center;

  @media (max-width: 820px) {
    grid-template-columns: repeat(2, 220px);
    gap: 16px;
    padding: 32px 24px 36px;
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
    width: 100%;
    max-width: 100%;
    gap: 10px;
    padding: 20px 16px 24px;
  }
`;

const AppButton = styled(motion.button)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  padding: 24px 20px;
  border-radius: 18px;
  border: 1px solid ${({ $hovered, $color }) => $hovered ? `${$color}30` : 'rgba(255, 255, 255, 0.02)'};
  background: ${({ $hovered, $color }) => $hovered ? `${$color}0d` : 'rgba(255, 255, 255, 0.01)'};
  cursor: pointer;
  text-align: left;
  position: relative;
  overflow: hidden;
  outline: none;
  width: 100%;
  transition: border-color 0.25s cubic-bezier(0.16, 1, 0.3, 1), background 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at top left, ${({ $color }) => $color}10 0%, transparent 60%);
    opacity: ${({ $hovered }) => $hovered ? 1 : 0};
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  @media (max-width: 520px) {
    flex-direction: row;
    align-items: center;
    gap: 14px;
    padding: 12px 16px;
    border-radius: 14px;
  }
`;

const IconBox = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: ${({ $color, $hovered }) => $hovered ? `${$color}22` : `${$color}14`};
  border: 1px solid ${({ $color, $hovered }) => $hovered ? `${$color}45` : `${$color}25`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color};
  position: relative;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: ${({ $hovered, $color }) => $hovered ? `0 0 16px ${$color}30` : 'none'};

  svg {
    width: 26px;
    height: 26px;
  }

  @media (max-width: 520px) {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    flex-shrink: 0;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const ActiveDot = styled(motion.div)`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  box-shadow: 0 0 10px ${({ $color }) => $color};
  border: 1.5px solid ${({ theme }) => theme.colors.background || '#111114'};
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const AppName = styled.span`
  color: ${({ theme, $hovered }) => $hovered ? theme.colors.text : theme.colors.textSecondary};
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.3;
  transition: color 0.2s ease;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
`;

const AppSub = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary}50;
  font-size: 11.5px;
  font-family: 'IBM Plex Mono', monospace;
  letter-spacing: 0.02em;
  font-weight: 500;
`;

const LAUNCHER_APPS = [
  {
    id: 'terminal',
    name: 'Cyber Terminal',
    sub: 'CLI & scripting',
    color: '#a3e635',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M4 17l5-5-5-5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11 19h9" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'monitor',
    name: 'System Diagnostics',
    sub: 'Performance monitor',
    color: '#67e8f9',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M3 12h3l2-7 4 14 3-10 2 3h4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'notes',
    name: 'Secure Logs Notepad',
    sub: 'Encrypted notes',
    color: '#fde68a',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="4" y="3" width="11" height="14" rx="1.5" strokeWidth="1.5"/>
        <path d="M7 8h5M7 11h5M7 14h3" strokeWidth="1.3" strokeLinecap="round"/>
        <rect x="13" y="13" width="7" height="7" rx="1.5" fill="currentColor" fillOpacity="0.12" strokeWidth="1.3"/>
        <path d="M15.5 15.8l1 1.2 2-2" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'music',
    name: 'YouTube Media Console',
    sub: 'YouTube player',
    color: '#f9a8d4',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="9" strokeWidth="1.5"/>
        <circle cx="12" cy="12" r="2.5" fill="currentColor"/>
        <path d="M10.5 9.5l5 2.5-5 2.5v-5z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'browser',
    name: 'Web Sandbox',
    sub: 'Isolated browser',
    color: '#c4b5fd',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="9" strokeWidth="1.5"/>
        <ellipse cx="12" cy="12" rx="3.5" ry="9" strokeWidth="1.2" strokeOpacity="0.6"/>
        <path d="M3 12h18" strokeWidth="1.2" strokeOpacity="0.6"/>
        <path d="M5 7.5h14M5 16.5h14" strokeWidth="1" strokeOpacity="0.4"/>
      </svg>
    ),
  },
  {
    id: 'hackerhub',
    name: 'HackerHub',
    sub: 'CTF & security',
    color: '#fca5a5',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 3l7 3v5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M9.5 12l2 2 3.5-3.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function AppLauncher() {
  const { isLauncherOpen, runningApps, launchApp, toggleLauncher, closeLauncher } = useApps();
  const [hoveredApp, setHoveredApp] = useState(null);
  const [minimized, setMinimized] = useState(false);

  // Close launcher on Escape key
  useEffect(() => {
    if (!isLauncherOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeLauncher();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLauncherOpen, closeLauncher]);

  return (
    <>
      <LauncherButton
        onClick={toggleLauncher}
        $active={isLauncherOpen}
        title="Open App Dashboard"
        whileTap={{ scale: 0.95 }}
      >
        <i className="fas fa-th-large" />
        <span>All Apps</span>
        <AnimatePresence>
          {!isLauncherOpen && (
            <PulseRing
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.25, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>
      </LauncherButton>

      {createPortal(
        <AnimatePresence>
          {isLauncherOpen && (
            <FullscreenOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              onClick={closeLauncher}
            >
              <WindowContainer
                onClick={(e) => e.stopPropagation()}
                initial={{ y: 20, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Title bar */}
                <TitleBar $minimized={minimized}>
                  {/* Title (Left aligned) */}
                  <WindowTitle style={{ paddingLeft: '8px' }}>All Apps</WindowTitle>

                  {/* Traffic lights (Right aligned) */}
                  <TrafficLights>
                    <LightButton $color="#febc2e" onClick={() => setMinimized(v => !v)} title="Minimize" />
                    <LightButton $color="#28c840" onClick={closeLauncher} title="Maximize" />
                    <LightButton $color="#ff5f57" onClick={closeLauncher} title="Close" />
                  </TrafficLights>
                </TitleBar>

                {/* Body with collapsible height */}
                <AnimatePresence initial={false}>
                  {!minimized && (
                    <BodyContainer
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <AppGrid>
                        {LAUNCHER_APPS.map((app) => {
                          const isRunning = runningApps.some((ra) => ra.id === app.id);
                          const isHovered = hoveredApp === app.id;
                          return (
                            <AppButton
                              key={app.id}
                              onClick={() => launchApp(app.id)}
                              onMouseEnter={() => setHoveredApp(app.id)}
                              onMouseLeave={() => setHoveredApp(null)}
                              whileTap={{ scale: 0.97 }}
                              $color={app.color}
                              $hovered={isHovered}
                            >
                              {/* Icon container */}
                              <IconBox $color={app.color} $hovered={isHovered}>
                                {app.icon}
                                {isRunning && (
                                  <ActiveDot
                                    $color={app.color}
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                  />
                                )}
                              </IconBox>

                              {/* Texts */}
                              <TextContainer>
                                <AppName $hovered={isHovered}>{app.name}</AppName>
                                <AppSub>{app.sub}</AppSub>
                              </TextContainer>
                            </AppButton>
                          );
                        })}
                      </AppGrid>
                    </BodyContainer>
                  )}
                </AnimatePresence>
              </WindowContainer>
            </FullscreenOverlay>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
