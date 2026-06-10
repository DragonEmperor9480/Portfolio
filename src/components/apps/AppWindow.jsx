/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, useDragControls } from 'framer-motion';
import { useApps } from '../../context/AppsContext';

const WindowContainer = styled(motion.div)`
  position: fixed;
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid ${({ theme }) => theme.colors.primary}40;
  border-radius: 16px;
  box-shadow: 
    0 24px 64px -16px rgba(0, 0, 0, 0.75),
    0 0 0 1px ${({ theme }) => theme.colors.primary}15 inset;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: ${({ $zIndex }) => $zIndex};
  
  /* Size and constraints */
  min-width: 320px;
  min-height: 240px;
  max-width: 100vw;
  max-height: 100vh;
  
  /* CSS Resize handle */
  resize: ${({ $isMaximized }) => ($isMaximized ? 'none' : 'both')};
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 14px;
    height: 14px;
    cursor: se-resize;
    background: linear-gradient(135deg, transparent 50%, ${({ theme }) => theme.colors.primary}b0 100%);
    pointer-events: none;
    display: ${({ $isMaximized }) => ($isMaximized ? 'none' : 'block')};
  }
`;

const TitleBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.25);
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary}20;
  cursor: grab;
  user-select: none;
  flex-shrink: 0;

  &:active {
    cursor: grabbing;
  }
`;

const WindowTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.text};
  text-transform: uppercase;

  i {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 0.9rem;
    filter: drop-shadow(0 0 4px ${({ theme }) => theme.colors.primary}50);
  }
`;

const ControlsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ControlButton = styled.button`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${({ $type }) => 
    $type === 'close' ? 'rgba(239, 68, 68, 0.2)' : 
    $type === 'maximize' ? 'rgba(34, 197, 94, 0.2)' : 
    'rgba(234, 179, 8, 0.2)'};
  color: ${({ $type }) => 
    $type === 'close' ? '#ef4444' : 
    $type === 'maximize' ? '#22c55e' : 
    '#eab308'};
  width: 24px;
  height: 24px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background: ${({ $type }) => 
      $type === 'close' ? 'rgba(239, 68, 68, 0.15)' : 
      $type === 'maximize' ? 'rgba(34, 197, 94, 0.15)' : 
      'rgba(234, 179, 8, 0.15)'};
    border-color: ${({ $type }) => 
      $type === 'close' ? '#ef4444' : 
      $type === 'maximize' ? '#22c55e' : 
      '#eab308'};
    box-shadow: 0 0 8px ${({ $type }) => 
      $type === 'close' ? 'rgba(239, 68, 68, 0.4)' : 
      $type === 'maximize' ? 'rgba(34, 197, 94, 0.4)' : 
      'rgba(234, 179, 8, 0.4)'};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const WindowContent = styled.div`
  flex-grow: 1;
  overflow: auto;
  position: relative;
  background: rgba(0, 0, 0, 0.15);
`;

export default function AppWindow({ app, zIndex, children }) {
  const { closeApp, toggleMaximize, toggleMinimize, focusApp, updateWindowPosition, updateWindowSize } = useApps();
  const dragControls = useDragControls();
  const windowRef = useRef(null);

  // Monitor resize event to update size in state if resized manually
  useEffect(() => {
    if (!windowRef.current || app.isMaximized || app.isMinimized) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        // Check if size actually changed to avoid infinite loops
        if (Math.abs(app.width - width) > 2 || Math.abs(app.height - height) > 2) {
          updateWindowSize(app.id, width, height);
        }
      }
    });

    resizeObserver.observe(windowRef.current);
    return () => resizeObserver.disconnect();
  }, [app.id, app.width, app.height, app.isMaximized, app.isMinimized, updateWindowSize]);

  // Bring window to focus on mount
  useEffect(() => {
    focusApp(app.id);
  }, [app.id, focusApp]);

  if (app.isMinimized) return null;

  const handleTitleDoubleClick = () => {
    toggleMaximize(app.id);
  };

  const handleDragEnd = () => {
    if (!windowRef.current) return;
    const rect = windowRef.current.getBoundingClientRect();
    updateWindowPosition(app.id, rect.left, rect.top);
  };

  // Maximum dimension calculations
  const styleProps = app.isMaximized
    ? {
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        borderRadius: 0,
      }
    : {
        top: app.y,
        left: app.x,
        width: app.width,
        height: app.height,
      };

  return (
    <WindowContainer
      ref={windowRef}
      $zIndex={zIndex}
      $isMaximized={app.isMaximized}
      style={styleProps}
      drag={!app.isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 15 }}
      onDragEnd={handleDragEnd}
      onPointerDown={() => focusApp(app.id)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <TitleBar
        onPointerDown={(e) => !app.isMaximized && dragControls.start(e)}
        onDoubleClick={handleTitleDoubleClick}
      >
        <WindowTitle>
          <i className={app.icon} />
          <span>{app.title}</span>
        </WindowTitle>
        <ControlsGroup>
          <ControlButton
            $type="minimize"
            onClick={() => toggleMinimize(app.id)}
            title="Minimize"
          >
            <i className="fas fa-minus" />
          </ControlButton>
          <ControlButton
            $type="maximize"
            onClick={() => toggleMaximize(app.id)}
            title={app.isMaximized ? 'Restore' : 'Maximize'}
          >
            <i className={app.isMaximized ? 'fas fa-compress-alt' : 'fas fa-expand-alt'} />
          </ControlButton>
          <ControlButton
            $type="close"
            onClick={() => closeApp(app.id)}
            title="Close"
          >
            <i className="fas fa-times" />
          </ControlButton>
        </ControlsGroup>
      </TitleBar>
      <WindowContent>
        {children}
      </WindowContent>
    </WindowContainer>
  );
}
