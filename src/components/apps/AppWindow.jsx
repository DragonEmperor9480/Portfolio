'use client';

/* eslint-disable react/prop-types */
import { useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useApps } from '../../context/AppsContext';

/* ─── Styled Components ─────────────────────────────────────────────── */

const WindowContainer = styled(motion.div)`
  position: fixed;
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid ${({ theme }) => theme.colors.primary}40;
  border-radius: ${({ $isMaximized }) => ($isMaximized ? '0' : '16px')};
  box-shadow:
    0 24px 64px -16px rgba(0, 0, 0, 0.75),
    0 0 0 1px ${({ theme }) => theme.colors.primary}15 inset;
  display: flex;
  flex-direction: column;
  z-index: ${({ $zIndex }) => $zIndex};

  /* Size constraints for non-maximized state */
  min-width: 320px;
  min-height: 240px;

  /* CSS resize handle (only in non-maximized state) */
  resize: ${({ $isMaximized }) => ($isMaximized ? 'none' : 'both')};
  overflow: ${({ $isMaximized }) => ($isMaximized ? 'hidden' : 'auto')};

  /* Resize grip indicator */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 14px;
    height: 14px;
    cursor: se-resize;
    background: linear-gradient(
      135deg,
      transparent 50%,
      ${({ theme }) => theme.colors.primary}b0 100%
    );
    pointer-events: none;
    display: ${({ $isMaximized }) => ($isMaximized ? 'none' : 'block')};
    border-bottom-right-radius: 16px;
    z-index: 10;
  }
`;

const TitleBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary}20;
  user-select: none;
  flex-shrink: 0;
  cursor: ${({ $isDraggable }) => ($isDraggable ? 'grab' : 'default')};
  border-radius: ${({ $isMaximized }) => $isMaximized ? '0' : '16px 16px 0 0'};

  &:active {
    cursor: ${({ $isDraggable }) => ($isDraggable ? 'grabbing' : 'default')};
  }
`;

const WindowTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.text};
  text-transform: uppercase;

  i {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 0.85rem;
    filter: drop-shadow(0 0 4px ${({ theme }) => theme.colors.primary}50);
  }
`;

const ControlsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ControlButton = styled.button`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid
    ${({ $type }) =>
      $type === 'close'
        ? 'rgba(239, 68, 68, 0.3)'
        : $type === 'maximize'
        ? 'rgba(34, 197, 94, 0.3)'
        : 'rgba(234, 179, 8, 0.3)'};
  color: ${({ $type }) =>
    $type === 'close'
      ? '#ef4444'
      : $type === 'maximize'
      ? '#22c55e'
      : '#eab308'};
  width: 22px;
  height: 22px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.62rem;
  transition: all 0.18s ease;
  flex-shrink: 0;

  &:hover {
    background: ${({ $type }) =>
      $type === 'close'
        ? 'rgba(239, 68, 68, 0.18)'
        : $type === 'maximize'
        ? 'rgba(34, 197, 94, 0.18)'
        : 'rgba(234, 179, 8, 0.18)'};
    border-color: ${({ $type }) =>
      $type === 'close' ? '#ef4444' : $type === 'maximize' ? '#22c55e' : '#eab308'};
    box-shadow: 0 0 8px
      ${({ $type }) =>
        $type === 'close'
          ? 'rgba(239,68,68,0.4)'
          : $type === 'maximize'
          ? 'rgba(34,197,94,0.4)'
          : 'rgba(234,179,8,0.4)'};
    transform: scale(1.08);
  }

  &:active {
    transform: scale(0.92);
  }
`;

/* 
 * WindowContent:
 * - overflow: auto  → allows scrolling inside each app
 * - pointer-events: auto → ensures scroll wheel works
 * - touch-action: pan-y  → allows touch scroll without triggering drag
 */
const WindowContent = styled.div`
  flex: 1;
  overflow: auto;
  position: relative;
  background: rgba(0, 0, 0, 0.12);
  border-radius: ${({ $isMaximized }) => $isMaximized ? '0' : '0 0 16px 16px'};
  min-height: 0; /* crucial: allows flex child to shrink and scroll */

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.22);
  }
`;

/* ─── Component ─────────────────────────────────────────────────────── */

export default function AppWindow({ app, zIndex, children }) {
  const { closeApp, toggleMaximize, toggleMinimize, focusApp, updateWindowPosition, updateWindowSize } =
    useApps();

  const windowRef   = useRef(null);
  const dragState   = useRef({ dragging: false, startMouseX: 0, startMouseY: 0, startWinX: 0, startWinY: 0 });

  /* ── Focus on mount ── */
  useEffect(() => {
    focusApp(app.id);
  }, [app.id, focusApp]);

  /* ── CSS resize observer (for the native resize handle) ── */
  useEffect(() => {
    if (!windowRef.current || app.isMaximized || app.isMinimized) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (Math.abs(app.width - width) > 2 || Math.abs(app.height - height) > 2) {
          updateWindowSize(app.id, width, height);
        }
      }
    });
    ro.observe(windowRef.current);
    return () => ro.disconnect();
  }, [app.id, app.width, app.height, app.isMaximized, app.isMinimized, updateWindowSize]);

  /* ── Manual drag implementation ──
   *
   * WHY: framer-motion's <drag> prop accumulates its own internal transform
   * offset (via translateX/translateY) on top of the CSS top/left position.
   * After onDragEnd saves getBoundingClientRect() to state and re-renders
   * with the new top/left values, the stale framer transform is still applied
   * additively, causing the window to jump/teleport to the wrong location.
   *
   * The fix is to drive position entirely through CSS top/left ourselves,
   * using raw mousemove/mouseup events — giving pixel-perfect placement.
   */
  const handleTitleMouseDown = useCallback(
    (e) => {
      if (app.isMaximized) return;
      // Only react to left mouse button, ignore clicks on control buttons
      if (e.button !== 0) return;
      if (e.target.closest('button')) return;

      e.preventDefault();
      focusApp(app.id);

      dragState.current = {
        dragging: true,
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startWinX: app.x,
        startWinY: app.y,
      };

      const onMouseMove = (ev) => {
        if (!dragState.current.dragging || !windowRef.current) return;

        const dx = ev.clientX - dragState.current.startMouseX;
        const dy = ev.clientY - dragState.current.startMouseY;

        let newX = dragState.current.startWinX + dx;
        let newY = dragState.current.startWinY + dy;

        // Clamp so the window title bar never goes fully off-screen
        const margin = 40;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        newX = Math.max(-app.width + margin, Math.min(vw - margin, newX));
        newY = Math.max(0, Math.min(vh - margin, newY));

        // Directly mutate the DOM for smooth 60fps dragging (no React re-render lag)
        windowRef.current.style.left = `${newX}px`;
        windowRef.current.style.top  = `${newY}px`;
      };

      const onMouseUp = (ev) => {
        if (!dragState.current.dragging) return;
        dragState.current.dragging = false;

        // Read final position and persist to React state
        const finalX = dragState.current.startWinX + (ev.clientX - dragState.current.startMouseX);
        const finalY = dragState.current.startWinY + (ev.clientY - dragState.current.startMouseY);

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const margin = 40;
        const clampedX = Math.max(-app.width + margin, Math.min(vw - margin, finalX));
        const clampedY = Math.max(0, Math.min(vh - margin, finalY));

        updateWindowPosition(app.id, clampedX, clampedY);

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [app.id, app.isMaximized, app.x, app.y, app.width, focusApp, updateWindowPosition]
  );

  /* ── Scroll wheel: stop propagation so Lenis doesn't steal it ── */
  const handleWheel = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (app.isMinimized) return null;

  /* ── Position / size styles ──
   *
   * Maximized: snap to safe viewport area (below 0px top, full width/height).
   * Normal: use stored x/y from state.
   *
   * IMPORTANT: do NOT use framer-motion's drag prop — use style directly.
   * This avoids the transform accumulation bug.
   */
  const styleProps = app.isMaximized
    ? {
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw',
        maxHeight: '100vh',
        borderRadius: 0,
      }
    : {
        top: app.y,
        left: app.x,
        width: app.width,
        height: app.height,
        maxWidth: 'calc(100vw - 20px)',
        maxHeight: 'calc(100vh - 20px)',
      };

  return (
    <WindowContainer
      ref={windowRef}
      $zIndex={zIndex}
      $isMaximized={app.isMaximized}
      style={styleProps}
      onPointerDown={() => focusApp(app.id)}
      onWheel={handleWheel}
      /* Entry/exit animation only — NO drag prop */
      initial={{ opacity: 0, scale: 0.94, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 8 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
    >
      <TitleBar
        $isDraggable={!app.isMaximized}
        $isMaximized={app.isMaximized}
        onMouseDown={handleTitleMouseDown}
        onDoubleClick={() => toggleMaximize(app.id)}
      >
        <WindowTitle>
          <i className={app.icon} />
          <span>{app.title}</span>
        </WindowTitle>

        <ControlsGroup>
          <ControlButton
            $type="minimize"
            onClick={(e) => { e.stopPropagation(); toggleMinimize(app.id); }}
            title="Minimize"
          >
            <i className="fas fa-minus" />
          </ControlButton>
          <ControlButton
            $type="maximize"
            onClick={(e) => { e.stopPropagation(); toggleMaximize(app.id); }}
            title={app.isMaximized ? 'Restore' : 'Maximize'}
          >
            <i className={app.isMaximized ? 'fas fa-compress-alt' : 'fas fa-expand-alt'} />
          </ControlButton>
          <ControlButton
            $type="close"
            onClick={(e) => { e.stopPropagation(); closeApp(app.id); }}
            title="Close"
          >
            <i className="fas fa-times" />
          </ControlButton>
        </ControlsGroup>
      </TitleBar>

      <WindowContent
        $isMaximized={app.isMaximized}
        onWheel={handleWheel}
      >
        {children}
      </WindowContent>
    </WindowContainer>
  );
}
