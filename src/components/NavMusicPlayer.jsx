'use client';

/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '../context/ThemeContext';
import { themes } from '../themes/themes';
import { usePlayer } from '../context/PlayerContext';

/* ─── Styled Components ───────────────────────────────────────────── */

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const TriggerBtn = styled(motion.button)`
  background: ${({ theme }) => `${theme?.colors?.background || '#0a192f'}cc`};
  border: 1px solid ${({ theme }) => `${theme?.colors?.primary || '#64ffda'}40`};
  border-radius: 50px;
  padding: 6px 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme?.colors?.text || '#E6E6E6'};
  transition: all 0.25s ease;
  outline: none;
  white-space: nowrap;

  &:hover {
    border-color: ${({ theme }) => theme?.colors?.primary || '#64ffda'};
    background: ${({ theme }) => `${theme?.colors?.primary || '#64ffda'}10`};
  }

  .disc-icon {
    font-size: 0.85rem;
    color: ${({ theme }) => theme?.colors?.primary || '#64ffda'};
    filter: drop-shadow(0 0 4px ${({ theme }) => theme?.colors?.primary || '#64ffda'});
  }

  .track-name {
    max-width: 110px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
  }

  .led {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: ${props =>
      props.$isPlaying
        ? props.theme?.colors?.primary || '#64ffda'
        : 'rgba(255,255,255,0.18)'};
    box-shadow: ${props =>
      props.$isPlaying
        ? `0 0 6px ${props.theme?.colors?.primary || '#64ffda'}`
        : 'none'};
    transition: all 0.3s ease;
    flex-shrink: 0;
  }
`;

const DropdownPanel = styled(motion.div)`
  position: fixed;
  top: ${props => props.$top}px;
  right: ${props => props.$right}px;
  background: ${({ theme }) => {
    const glass = theme.colors.glass || 'rgba(17, 17, 20, 0.75)';
    if (typeof glass === 'string' && glass.startsWith('rgba')) {
      return glass.replace(/,\s*0\.\d+\s*\)$/, ', 0.28)');
    }
    return 'rgba(17, 17, 20, 0.28)';
  }};
  backdrop-filter: blur(32px) saturate(220%);
  -webkit-backdrop-filter: blur(32px) saturate(220%);
  border: 1px solid ${({ theme }) => theme?.colors?.border || 'rgba(100,255,218,0.15)'};
  border-radius: 20px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 300px;
  box-shadow:
    0 30px 60px -15px rgba(0, 0, 0, 0.7),
    0 0 0 1px rgba(255, 255, 255, 0.04) inset;
  z-index: 200;
  font-family: 'Space Grotesk', sans-serif;
  overflow: hidden;

  @media (max-width: 768px) {
    position: fixed;
    top: 80px !important;
    left: 14px !important;
    right: 14px !important;
    width: auto !important;
    transform: none !important;
  }
`;

const PanelHeader = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  color: ${({ theme }) => theme?.colors?.text || '#E6E6E6'};
  opacity: 0.8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 8px;
`;

const CoverArtContainer = styled.div`
  width: 100%;
  height: 140px;
  border-radius: 14px;
  overflow: hidden;
  background: #060913;
  position: relative;
  box-shadow: 0 10px 24px -8px rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.04);
`;

const CoverArtWrapper = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: relative;
`;

const CoverOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.15) 65%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 12px;
  z-index: 2;
`;

const TrackTitle = styled.h3`
  font-size: 0.88rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 2px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackGenre = styled.span`
  font-size: 0.6rem;
  font-weight: 600;
  color: ${({ theme }) => theme?.colors?.primary || '#64ffda'};
  text-transform: uppercase;
  letter-spacing: 1.5px;
`;

/* ─── Squiggly Progress Bar Styling ─── */
const ProgressBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 4px;
  cursor: pointer;
  user-select: none;
`;

const WaveSvg = styled.svg`
  width: 100%;
  height: 24px;
  overflow: visible;
`;

const TimeRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: 'Fira Code', monospace;
  font-size: 0.58rem;
  color: ${({ theme }) => theme?.colors?.textSecondary || '#B3B3B3'};
  opacity: 0.75;
  padding: 0 2px;
`;

const VisualizerWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 3px;
  height: 18px;
  width: 100%;
  opacity: 0.85;
`;

const VisualizerBar = styled(motion.div)`
  flex: 1;
  height: 4px;
  background: ${({ theme }) => theme?.colors?.primary || '#64ffda'};
  border-radius: 2px;
  box-shadow: 0 0 5px ${({ theme }) => `${theme?.colors?.primary || '#64ffda'}60`};
`;

const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
`;

const ControlButton = styled(motion.button)`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme?.colors?.text || '#E6E6E6'};
  opacity: 0.7;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  transition: all 0.2s ease;
  outline: none;

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme?.colors?.primary || '#64ffda'};
    opacity: 1;
    background: rgba(255, 255, 255, 0.05);
  }

  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }
`;

const PlayButton = styled(ControlButton)`
  font-size: 1.15rem;
  background: ${({ theme }) => `${theme?.colors?.primary || '#64ffda'}15`};
  border: 1px solid ${({ theme }) => `${theme?.colors?.primary || '#64ffda'}35`};
  color: ${({ theme }) => theme?.colors?.primary || '#64ffda'};
  width: 46px;
  height: 46px;
  box-shadow: 0 0 10px ${({ theme }) => `${theme?.colors?.primary || '#64ffda'}10`};

  &:hover:not(:disabled) {
    background: ${({ theme }) => `${theme?.colors?.primary || '#64ffda'}25`};
    border-color: ${({ theme }) => theme?.colors?.primary || '#64ffda'};
    box-shadow: 0 0 16px ${({ theme }) => `${theme?.colors?.primary || '#64ffda'}30`};
  }
`;

const VolumeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.72rem;
  color: ${({ theme }) => theme?.colors?.textSecondary || '#B3B3B3'};
  padding: 5px 10px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.02);

  i {
    width: 14px;
    text-align: center;
    color: ${({ theme }) => theme?.colors?.primary || '#64ffda'};
  }
`;

const RangeInput = styled.input`
  flex: 1;
  -webkit-appearance: none;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
  cursor: pointer;
  border: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: ${({ theme }) => theme?.colors?.primary || '#64ffda'};
    cursor: pointer;
    box-shadow: 0 0 6px ${({ theme }) => theme?.colors?.primary || '#64ffda'};
  }
`;

const StationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  max-height: 100px;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  padding: 5px;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => `${theme?.colors?.primary || '#64ffda'}20`};
    border-radius: 2px;
  }
`;

const StationItem = styled.button`
  background: ${props => props.$active ? 'rgba(255,255,255,0.04)' : 'transparent'};
  border: 1px solid ${props => props.$active ? 'rgba(100,255,218,0.12)' : 'transparent'};
  color: ${props =>
    props.$active
      ? ({ theme }) => theme?.colors?.primary || '#64ffda'
      : ({ theme }) => theme?.colors?.text || '#E6E6E6'};
  font-family: inherit;
  font-size: 0.68rem;
  padding: 5px 9px;
  border-radius: 7px;
  width: 100%;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
    color: ${({ theme }) => theme?.colors?.primary || '#64ffda'};
  }
`;

const InputRow = styled.div`
  display: flex;
  gap: 5px;
`;

const CustomInput = styled.input`
  flex: 1;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 7px;
  color: ${({ theme }) => theme?.colors?.text || '#E6E6E6'};
  font-family: inherit;
  font-size: 0.68rem;
  padding: 5px 9px;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${({ theme }) => theme?.colors?.primary || '#64ffda'};
  }
`;

const CustomBtn = styled.button`
  background: ${({ theme }) => `${theme?.colors?.primary || '#64ffda'}15`};
  border: 1px solid ${({ theme }) => `${theme?.colors?.primary || '#64ffda'}30`};
  color: ${({ theme }) => theme?.colors?.text || '#E6E6E6'};
  border-radius: 7px;
  font-family: inherit;
  font-size: 0.68rem;
  font-weight: 600;
  padding: 5px 10px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => `${theme?.colors?.primary || '#64ffda'}25`};
    border-color: ${({ theme }) => theme?.colors?.primary || '#64ffda'};
    color: ${({ theme }) => theme?.colors?.primary || '#64ffda'};
  }
`;

/* ─── Helpers ────────────────────────────────────────────────────── */

const formatTime = (secs) => {
  if (isNaN(secs) || secs === undefined || secs < 0) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

/* ─── Wavy Progress Bar Sub-Component ────────────────────────────── */

function WavyProgressBar({ isPlaying, playerRef, isReady, currentIdx, themePrimary }) {
  const containerRef = useRef(null);
  const pathRef      = useRef(null);
  const thumbRef     = useRef(null);
  const lineRef      = useRef(null);
  const elapsedRef   = useRef(null);
  const totalRef     = useRef(null);

  const widthRef     = useRef(264);
  const phaseRef     = useRef(0);
  const ampRef       = useRef(0);
  const timeRef      = useRef(0);
  const durationRef  = useRef(0);
  const isDraggingRef = useRef(false);

  // Responsive width tracking
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        widthRef.current = entry.contentRect.width || 264;
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Reset progress state when track changes
  useEffect(() => {
    timeRef.current = 0;
    durationRef.current = 0;
    if (elapsedRef.current) elapsedRef.current.textContent = '0:00';
    if (totalRef.current) totalRef.current.textContent = '0:00';
  }, [currentIdx]);

  // High performance direct-DOM animation loop
  useEffect(() => {
    let frameId;
    let lastTime = performance.now();

    const tick = (now) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Phase scroll speed & amplitude transitions
      if (isPlaying) {
        phaseRef.current = (phaseRef.current + delta * 6) % (Math.PI * 2);
        ampRef.current = ampRef.current + (3.8 - ampRef.current) * 0.08;
      } else {
        ampRef.current = ampRef.current + (0 - ampRef.current) * 0.12;
      }

      // Query current time
      let curTime = 0;
      if (isDraggingRef.current) {
        curTime = timeRef.current;
      } else if (playerRef.current && isReady && playerRef.current.getCurrentTime) {
        try {
          curTime = playerRef.current.getCurrentTime() || 0;
          timeRef.current = curTime;
        } catch {
          curTime = timeRef.current;
        }
      }

      // Query track duration
      let dur = durationRef.current;
      if (dur === 0 && playerRef.current && isReady && playerRef.current.getDuration) {
        try {
          dur = playerRef.current.getDuration() || 0;
          durationRef.current = dur;
        } catch {
          dur = 0;
        }
      }

      const progress = dur > 0 ? curTime / dur : 0;
      const w = widthRef.current;
      const currentX = progress * w;
      const centerY = 12; // vertical center of SVG

      // Update played squiggle line
      if (pathRef.current) {
        let d = `M 0,${centerY}`;
        const wavelength = 32; // Physical wavelength in pixels
        const freq = (2 * Math.PI) / wavelength;
        const step = 1.5; // High resolution sample intervals

        for (let x = step; x <= currentX; x += step) {
          const y = centerY + Math.sin(x * freq - phaseRef.current) * ampRef.current;
          d += ` L ${x},${y}`;
        }
        d += ` L ${currentX},${centerY}`;
        pathRef.current.setAttribute('d', d);
      }

      // Update playhead position
      if (thumbRef.current) {
        thumbRef.current.setAttribute('cx', currentX);
      }

      // Update remaining track straight line
      if (lineRef.current) {
        lineRef.current.setAttribute('x1', currentX);
        lineRef.current.setAttribute('x2', w);
      }

      // Update time stamps
      if (elapsedRef.current) {
        elapsedRef.current.textContent = formatTime(curTime);
      }
      if (totalRef.current && dur > 0) {
        totalRef.current.textContent = formatTime(dur);
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, isReady, playerRef]);

  // Handle click / drag inputs
  const handleInteraction = (clientX) => {
    if (!containerRef.current || !playerRef.current || !isReady) return;
    const w = widthRef.current || 264;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(w, clientX - rect.left));
    const newProgress = clickX / w;
    const dur = durationRef.current;
    
    if (dur > 0) {
      const newTime = newProgress * dur;
      timeRef.current = newTime;
      if (elapsedRef.current) elapsedRef.current.textContent = formatTime(newTime);
      try {
        playerRef.current.seekTo(newTime, true);
      } catch { /* skip */ }
    }
  };

  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    handleInteraction(e.clientX);

    const handleMouseMove = (moveEvent) => {
      if (!isDraggingRef.current) return;
      handleInteraction(moveEvent.clientX);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e) => {
    isDraggingRef.current = true;
    handleInteraction(e.touches[0].clientX);

    const handleTouchMove = (moveEvent) => {
      if (!isDraggingRef.current) return;
      handleInteraction(moveEvent.touches[0].clientX);
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <ProgressBarContainer ref={containerRef}>
      <WaveSvg
        height="24"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Remaining straight track */}
        <line
          ref={lineRef}
          y1="12"
          y2="12"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Played squiggly track */}
        <path
          ref={pathRef}
          fill="none"
          stroke={themePrimary}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: `drop-shadow(0 0 2px ${themePrimary}60)`
          }}
        />

        {/* Playhead thumb */}
        <circle
          ref={thumbRef}
          cy="12"
          r="4.5"
          fill="#ffffff"
          style={{
            filter: `drop-shadow(0 0 5px ${themePrimary})`,
            cursor: 'pointer'
          }}
        />
      </WaveSvg>
      <TimeRow>
        <span ref={elapsedRef}>0:00</span>
        <span ref={totalRef}>0:00</span>
      </TimeRow>
    </ProgressBarContainer>
  );
}

/* ─── Data ────────────────────────────────────────────────────────── */

/* ─── Component ───────────────────────────────────────────────────── */

export default function NavMusicPlayer() {
  const [isOpen, setIsOpen]         = useState(false);
  const [customUrl, setCustomUrl]   = useState('');
  const [imgError, setImgError]     = useState(false);
  const [visHeights, setVisHeights] = useState(Array(12).fill(4));

  // Shared player states from context
  const { 
    volume, 
    setVolume, 
    playerRef, 
    stations, 
    setStations,
    currentIdx, 
    setCurrentIdx, 
    isPlaying, 
    setIsPlaying, 
    isReady, 
    setIsReady, 
    currentVideoData, 
    setCurrentVideoData 
  } = usePlayer();

  const panelRef  = useRef(null);
  const btnRef    = useRef(null);

  const { currentTheme } = useTheme();

  const [coords, setCoords] = useState(null);

  const updateCoords = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 12,
        right: window.innerWidth - rect.right
      });
    }
  };

  const handleToggle = () => {
    updateCoords();
    playChime(!isOpen);
    setIsOpen(o => !o);
  };

  useEffect(() => {
    if (isOpen) {
      updateCoords();
      window.addEventListener('resize', updateCoords);
      window.addEventListener('scroll', updateCoords, { passive: true });
    }
    return () => {
      window.removeEventListener('resize', updateCoords);
      window.removeEventListener('scroll', updateCoords);
    };
  }, [isOpen]);

  /* Reset per station switch */
  useEffect(() => {
    setImgError(false);
    setCurrentVideoData({ title: '', author: '' });
  }, [currentIdx, setCurrentVideoData]);

  /* Chime */
  const playChime = (isPlay) => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const now = ctx.currentTime;
      const tone = (freq, t, dur) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime((volume / 100) * 0.07, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.start(t); osc.stop(t + dur);
      };
      if (isPlay) {
        tone(523.25, now,       0.12);
        tone(659.25, now + 0.08, 0.12);
        tone(783.99, now + 0.16, 0.18);
      } else {
        tone(783.99, now,       0.10);
        tone(659.25, now + 0.06, 0.10);
        tone(523.25, now + 0.12, 0.15);
      }
    } catch { /* silent */ }
  };

  /* YouTube IFrame API */
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      (document.getElementsByTagName('script')[0]?.parentNode || document.head)
        .insertBefore(tag, document.getElementsByTagName('script')[0]);
    }

    let interval;
    const init = () => {
      if (playerRef.current) return;
      try {
        playerRef.current = new window.YT.Player('yt-nav-player', {
          height: '0', width: '0',
          videoId: stations[0]?.id || '',
          playerVars: { autoplay: 0, controls: 0, disablekb: 1, fs: 0, rel: 0, playsinline: 1 },
          events: {
            onReady: (e) => {
              setIsReady(true);
              e.target.setVolume(volume);
              const d = e.target.getVideoData?.();
              if (d?.title) setCurrentVideoData({ title: d.title, author: d.author || '' });
            },
            onStateChange: (e) => {
              setIsPlaying(e.data === 1);
              const d = e.target.getVideoData?.();
              if (d?.title) setCurrentVideoData({ title: d.title, author: d.author || '' });
            },
          },
        });
      } catch { /* skip */ }
    };

    interval = setInterval(() => {
      if (window.YT?.Player) { clearInterval(interval); init(); }
    }, 200);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Visualizer */
  useEffect(() => {
    let t;
    const tick = () => {
      setVisHeights(isPlaying
        ? Array.from({ length: 12 }, () => 4 + Math.random() * 16)
        : Array(12).fill(4));
      t = setTimeout(tick, 100);
    };
    tick();
    return () => clearTimeout(t);
  }, [isPlaying]);

  /* Click-outside */
  useEffect(() => {
    const handler = (e) => {
      // If the target is no longer in the DOM, it was likely detached during a React state render
      // (e.g. toggling the play/pause icon or switching tracks). Ignore these clicks.
      if (e.target && (!e.target.isConnected || !document.body.contains(e.target))) {
        return;
      }

      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        btnRef.current   && !btnRef.current.contains(e.target)
      ) setIsOpen(false);
    };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  /* Controls */
  const togglePlay = () => {
    if (!playerRef.current || !isReady) return;
    if (isPlaying) { playChime(false); playerRef.current.pauseVideo(); }
    else           { playChime(true);  playerRef.current.playVideo();  }
  };

  const handleVol = (e) => {
    const v = +e.target.value;
    setVolume(v);
    playerRef.current?.setVolume?.(v);
  };

  const selectStation = (idx) => {
    setCurrentIdx(idx);
    setCurrentVideoData({ title: '', author: '' });
    if (playerRef.current && isReady) {
      playChime(true);
      playerRef.current.loadVideoById(stations[idx]?.id || '');
      setIsPlaying(true);
    }
  };

  const handleNext = () => selectStation((currentIdx + 1) % stations.length);
  const handlePrev = () => selectStation((currentIdx - 1 + stations.length) % stations.length);

  const loadCustom = () => {
    if (!customUrl.trim() || !playerRef.current || !isReady) return;
    let id = customUrl.trim();
    if (customUrl.includes('youtube.com') || customUrl.includes('youtu.be')) {
      const m = customUrl.match(/^.*(youtu\.be\/|v\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
      if (m && m[2].length === 11) id = m[2];
    }
    if (id.length === 11) {
      playChime(true);
      setCurrentVideoData({ title: '', author: '' });
      playerRef.current.loadVideoById(id);
      setIsPlaying(true);
      const updatedStations = [...stations];
      updatedStations[currentIdx] = { name: 'CUSTOM STREAM', id, genre: 'User Link' };
      setStations(updatedStations);
      setCustomUrl('');
    }
  };

  const displayName = (currentVideoData.title || stations[currentIdx]?.name || 'Unknown Track')
    .replace('.SH', '').replace('.WAV', '').replace(/_/g, ' ');

  return (
    <Wrapper>
      {/* Hidden YT player target — only render once globally */}
      <div style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}>
        <div id="yt-nav-player" />
      </div>

      <TriggerBtn
        ref={btnRef}
        $isPlaying={isPlaying}
        onClick={handleToggle}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        aria-label="Toggle media player"
      >
        <motion.i
          className="fas fa-compact-disc disc-icon"
          animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
          transition={isPlaying
            ? { repeat: Infinity, duration: 4, ease: 'linear' }
            : { duration: 0.2 }}
        />
        <span className="track-name">
          {isPlaying ? displayName : 'MEDIA.EXE'}
        </span>
        <span className="led" />
      </TriggerBtn>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && coords && (
            <DropdownPanel
              data-music-player-portal="true"
              ref={panelRef}
              $top={coords.top}
              $right={coords.right}
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
            {/* Header */}
            <PanelHeader>
              <span>SYS_PLAYER</span>
              <span style={{
                fontSize: '0.6rem',
                color: isPlaying ? (themes[currentTheme]?.colors?.primary || '#64ffda') : 'inherit',
                opacity: 0.85,
                fontWeight: 700,
              }}>
                {isPlaying ? '● PLAYING' : '● STANDBY'}
              </span>
            </PanelHeader>

            {/* Cover Art */}
            <CoverArtContainer>
              {!imgError && stations[currentIdx]?.id ? (
                <CoverArtWrapper
                  animate={isPlaying ? { scale: [1, 1.02, 1] } : { scale: 1 }}
                  transition={isPlaying ? { repeat: Infinity, duration: 6, ease: 'easeInOut' } : { duration: 0.2 }}
                >
                  <Image
                    src={`https://img.youtube.com/vi/${stations[currentIdx].id}/hqdefault.jpg`}
                    alt={stations[currentIdx].name}
                    fill
                    sizes="264px"
                    style={{ objectFit: 'cover', filter: 'brightness(0.85)' }}
                    onError={() => setImgError(true)}
                  />
                </CoverArtWrapper>
              ) : (
                <div style={{
                  width: '100%', height: '100%',
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <i className="fas fa-music" style={{
                    fontSize: '2rem',
                    color: themes[currentTheme]?.colors?.primary || '#64ffda',
                    opacity: 0.3,
                  }} />
                </div>
              )}
              <CoverOverlay>
                <TrackGenre>{currentVideoData.author || stations[currentIdx]?.genre || ''}</TrackGenre>
                <TrackTitle>{displayName}</TrackTitle>
              </CoverOverlay>
            </CoverArtContainer>

            {/* Wavy Progress Bar */}
            <WavyProgressBar
              isPlaying={isPlaying}
              playerRef={playerRef}
              isReady={isReady}
              currentIdx={currentIdx}
              themePrimary={themes[currentTheme]?.colors?.primary || '#64ffda'}
            />

            {/* Visualizer */}
            <VisualizerWrapper>
              {visHeights.map((h, i) => (
                <VisualizerBar
                  key={i}
                  animate={{ height: `${h}px` }}
                  transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                />
              ))}
            </VisualizerWrapper>

            {/* Controls */}
            <ControlsRow>
              <ControlButton onClick={handlePrev} disabled={!isReady} whileTap={{ scale: 0.9 }}>
                <i className="fas fa-step-backward" />
              </ControlButton>
              <PlayButton
                onClick={togglePlay}
                disabled={!isReady}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
              >
                <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`}
                   style={{ marginLeft: isPlaying ? 0 : '2px' }} />
              </PlayButton>
              <ControlButton onClick={handleNext} disabled={!isReady} whileTap={{ scale: 0.9 }}>
                <i className="fas fa-step-forward" />
              </ControlButton>
            </ControlsRow>

            {/* Volume */}
            <VolumeRow>
              <i className="fas fa-volume-up" />
              <RangeInput type="range" min="0" max="100" value={volume} onChange={handleVol} />
              <span style={{ width: '26px', textAlign: 'right', fontFamily: 'monospace' }}>{volume}%</span>
            </VolumeRow>

            {/* Station List */}
            <StationList>
              {stations.map((s, idx) => (
                <StationItem key={s.id} $active={idx === currentIdx} onClick={() => selectStation(idx)}>
                  <span>{s.name}</span>
                  <span style={{ fontSize: '0.58rem', opacity: 0.55 }}>{s.genre}</span>
                </StationItem>
              ))}
            </StationList>

            {/* Custom Stream */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Mount YouTube Link
              </span>
              <InputRow>
                <CustomInput
                  type="text"
                  placeholder="Paste YouTube URL or ID"
                  value={customUrl}
                  onChange={e => setCustomUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && loadCustom()}
                />
                <CustomBtn onClick={loadCustom}>Load</CustomBtn>
              </InputRow>
            </div>
          </DropdownPanel>
        )}
      </AnimatePresence>,
      document.body
    )}
    </Wrapper>
  );
}
