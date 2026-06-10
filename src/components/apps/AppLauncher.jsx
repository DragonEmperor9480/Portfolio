import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useApps, APPS } from '../../context/AppsContext';

const LauncherButton = styled(motion.button)`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.primary}30;
  color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.text};
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  font-size: 1.15rem;

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
  background: ${({ theme }) => theme.colors.background === '#000000' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(10, 25, 47, 0.75)'};
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  box-sizing: border-box;
`;

const LauncherContainer = styled(motion.div)`
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

const LauncherHeader = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;

  h2 {
    font-family: 'Syne', sans-serif;
    font-size: 2.2rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: ${({ theme }) => theme.colors.text};
    margin: 0;
    text-shadow: 0 0 15px ${({ theme }) => theme.colors.primary}30;
  }

  p {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 0;
    max-width: 600px;
    letter-spacing: 0.02em;
  }

  .tech-stamp {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.7rem;
    color: ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.primary}40;
    padding: 2px 10px;
    border-radius: 100px;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    box-shadow: 0 0 10px ${({ theme }) => theme.colors.primary}15;
  }
`;

const appGlowColors = {
  terminal: '#00ff41',
  monitor: '#01cdfe',
  notes: '#faef5d',
  music: '#f97e72',
  browser: '#a995c9',
};

const AppGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 32px;
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  justify-content: center;
  justify-items: center;
  align-items: start;
`;

const IconSquircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  position: relative;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 
    0 8px 20px rgba(0, 0, 0, 0.3),
    inset 0 0 0 1px rgba(255, 255, 255, 0.05);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 21px;
    background: radial-gradient(circle at center, ${({ $glowColor }) => $glowColor}15 0%, transparent 70%);
    opacity: 0.5;
    transition: all 0.4s ease;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 0%, transparent 100%);
    border-top-left-radius: 21px;
    border-top-right-radius: 21px;
    pointer-events: none;
  }
`;

const AppLabel = styled.span`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: color 0.3s ease;
  text-align: center;
  letter-spacing: 0.02em;
`;

const AppIconWrapper = styled(motion.button)`
  background: transparent;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  position: relative;
  outline: none;
  width: 120px;
  padding: 0;

  &:hover {
    ${IconSquircle} {
      transform: translateY(-6px) scale(1.05);
      border-color: ${({ $glowColor }) => $glowColor}80;
      box-shadow: 
        0 15px 30px -5px rgba(0, 0, 0, 0.5),
        0 0 24px ${({ $glowColor }) => $glowColor}40,
        inset 0 0 0 1px rgba(255, 255, 255, 0.1);
      color: ${({ $glowColor }) => $glowColor};
      background: rgba(255, 255, 255, 0.05);

      &::before {
        opacity: 0.8;
      }
    }

    ${AppLabel} {
      color: ${({ theme }) => theme.colors.text};
      text-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
    }
  }
`;

const DotIndicator = styled(motion.div)`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $glowColor }) => $glowColor};
  box-shadow: 0 0 8px ${({ $glowColor }) => $glowColor};
  margin-top: -4px;
`;

const DismissButton = styled(motion.button)`
  position: absolute;
  top: 40px;
  right: 40px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.primary}30;
  color: ${({ theme }) => theme.colors.text};
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 15px ${({ theme }) => theme.colors.primary}40;
    color: ${({ theme }) => theme.colors.primary};
    transform: scale(1.05);
  }
`;


export default function AppLauncher() {
  const { isLauncherOpen, runningApps, launchApp, toggleLauncher, closeLauncher } = useApps();

  // Escape key handler to close the launcher dashboard
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

  const appsList = Object.values(APPS);

  return (
    <>
      <LauncherButton
        onClick={toggleLauncher}
        $active={isLauncherOpen}
        title="Open App Dashboard"
        whileTap={{ scale: 0.95 }}
      >
        <i className="fas fa-th-large" />
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
              <DismissButton
                onClick={closeLauncher}
                whileTap={{ scale: 0.95 }}
                title="Close Dashboard (Esc)"
              >
                <i className="fas fa-times" />
              </DismissButton>

              <LauncherContainer
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inner content
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 30, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <LauncherHeader>
                  <span className="tech-stamp">System Executables</span>
                  <h2>PORTFOLIO OS v2.1</h2>
                  <p>
                    Select an application module below to deploy it in a responsive windowed frame. Drag, resize, and multitask across windows.
                  </p>
                </LauncherHeader>

                <AppGrid
                  variants={{
                    show: {
                      transition: {
                        staggerChildren: 0.05
                      }
                    }
                  }}
                  initial="hidden"
                  animate="show"
                >
                  {appsList.map((app) => {
                    const isRunning = runningApps.some((ra) => ra.id === app.id);
                    const glowColor = appGlowColors[app.id] || '#ffffff';
                    return (
                      <AppIconWrapper
                        key={app.id}
                        onClick={() => launchApp(app.id)}
                        $glowColor={glowColor}
                        variants={{
                          hidden: { opacity: 0, y: 15 },
                          show: { opacity: 1, y: 0 }
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <IconSquircle $glowColor={glowColor}>
                          <i className={app.icon} />
                        </IconSquircle>
                        {isRunning && (
                          <DotIndicator 
                            $glowColor={glowColor}
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                          />
                        )}
                        <AppLabel>{app.title}</AppLabel>
                      </AppIconWrapper>
                    );
                  })}
                </AppGrid>
              </LauncherContainer>
            </FullscreenOverlay>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
