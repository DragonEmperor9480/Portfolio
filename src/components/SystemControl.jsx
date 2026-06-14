'use client';

import { useState, useEffect, useRef } from 'react';
import styled, { useTheme as useStyledTheme } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../context/PlayerContext';
import { useTheme } from '../context/ThemeContext';
import { useApps } from '../context/AppsContext';

/* ─── Tray Button ─────────────────────────────────────────────────── */
const ControlContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StatusTrayButton = styled(motion.button)`
  background: ${({ theme }) => `${theme?.colors?.primary || '#64ffda'}08`};
  border: 1px solid ${({ theme }) => `${theme?.colors?.border || 'rgba(100,255,218,0.1)'}80`};
  border-radius: 12px;
  padding: 6px 12px;
  margin-left: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.25s ease;
  outline: none;

  &:hover {
    background: ${({ theme }) => `${theme?.colors?.primary || '#64ffda'}15`};
    border-color: ${({ theme }) => `${theme?.colors?.primary || '#64ffda'}60`};
    box-shadow: 0 0 14px ${({ theme }) => `${theme?.colors?.primary || '#64ffda'}18`};
  }

  @media (max-width: 480px) { display: none; }
`;

const TrayIcon = styled.span`
  color: ${props => props.$active ? props.$color : ({ theme }) => theme?.colors?.textSecondary || '#B3B3B3'};
  opacity: ${props => props.$active ? 1 : 0.6};
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;

  i {
    filter: ${props => props.$active ? `drop-shadow(0 0 4px ${props.$color})` : 'none'};
  }
`;

/* ─── Dropdown Panel ──────────────────────────────────────────────── */
const DropdownPanel = styled(motion.div)`
  position: absolute;
  top: calc(100% + 12px);
  left: 10px;
  background: ${({ theme }) => theme.colors.glass || 'rgba(10, 25, 47, 0.7)'};
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 280px;
  box-shadow: ${({ theme }) => theme.name === 'Light Mode' 
    ? '0 20px 48px -12px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05) inset' 
    : '0 20px 48px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.04) inset'};
  z-index: 101;
  font-family: 'Space Grotesk', sans-serif;
  will-change: transform, opacity;

  @media (max-width: 768px) {
    position: fixed;
    top: 80px;
    left: 14px;
    right: 14px;
    transform: none !important;
    width: auto;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const PanelTitle = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  color: ${({ theme }) => theme?.colors?.text || '#E6E6E6'};
  letter-spacing: 0.05em;
  text-transform: uppercase;
  opacity: 0.85;
`;

const StatusDot = styled.span`
  font-size: 0.65rem;
  font-weight: 600;
  color: ${props => props.$online ? '#4ade80' : '#f87171'};
  display: flex;
  align-items: center;
  gap: 5px;

  &::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: currentColor;
    box-shadow: 0 0 6px currentColor;
  }
`;

const SectionCard = styled.div`
  background: ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DeviceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.78rem;
`;

const DeviceName = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme?.colors?.text || '#E6E6E6'};
  font-weight: 500;

  i {
    color: ${props => props.$iconColor};
    font-size: 0.8rem;
  }
`;

const StatusBadge = styled.span`
  font-size: 0.6rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 6px;
  background: ${props => props.$type === 'online' 
    ? (props.theme.name === 'Light Mode' ? 'rgba(22, 163, 74, 0.1)' : 'rgba(74, 222, 128, 0.1)') 
    : (props.theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)')};
  color: ${props => props.$type === 'online' 
    ? (props.theme.name === 'Light Mode' ? '#16a34a' : '#4ade80') 
    : (props.theme.name === 'Light Mode' ? '#666666' : '#888888')};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ScannerItem = styled.button`
  width: 100%;
  background: ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.03)' : 'rgba(0, 0, 0, 0.2)'};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.4 : 1};
  transition: all 0.2s ease;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.05)'};
    border-color: ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

/* ─── Minimal Slider Styling ───────────────────────────────────────── */
const SliderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SliderMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.72rem;
  color: ${({ theme }) => theme?.colors?.textSecondary || '#B3B3B3'};
  
  .label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  .value {
    font-family: monospace;
    font-weight: 700;
  }
`;

const ModernSlider = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 3px;
  border-radius: 2px;
  background: ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'};
  outline: none;
  margin: 4px 0;
  position: relative;
  cursor: pointer;

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 3px;
    cursor: pointer;
    background: linear-gradient(
      to right, 
      ${({ theme }) => theme?.colors?.primary || '#64ffda'} 0%, 
      ${({ theme }) => theme?.colors?.primary || '#64ffda'} ${props => props.$pct}%, 
      ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'} ${props => props.$pct}%, 
      ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'} 100%
    );
    border-radius: 2px;
  }

  &::-webkit-slider-thumb {
    height: 12px;
    width: 12px;
    border-radius: 50%;
    background: ${({ theme }) => theme.name === 'Light Mode' ? theme.colors.primary : '#ffffff'};
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -4.5px;
    box-shadow: ${({ theme }) => theme.name === 'Light Mode' ? '0 1px 4px rgba(0, 0, 0, 0.25)' : '0 0 8px rgba(0, 0, 0, 0.5)'};
    transition: transform 0.1s ease;
  }

  &:hover::-webkit-slider-thumb {
    transform: scale(1.2);
  }

  &::-moz-range-track {
    width: 100%;
    height: 3px;
    cursor: pointer;
    background: ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'};
    border-radius: 2px;
  }

  &::-moz-range-progress {
    background: ${({ theme }) => theme?.colors?.primary || '#64ffda'};
    height: 3px;
    border-radius: 2px;
  }

  &::-moz-range-thumb {
    height: 12px;
    width: 12px;
    border-radius: 50%;
    background: ${({ theme }) => theme.name === 'Light Mode' ? theme.colors.primary : '#ffffff'};
    cursor: pointer;
    border: none;
    box-shadow: ${({ theme }) => theme.name === 'Light Mode' ? '0 1px 4px rgba(0, 0, 0, 0.25)' : '0 0 8px rgba(0, 0, 0, 0.5)'};
    transition: transform 0.1s ease;
  }

  &:hover::-moz-range-thumb {
    transform: scale(1.2);
  }
`;

export default function SystemControl() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [brightness, setBrightness] = useState(100);
  const { volume, setVolume } = usePlayer();
  const { setCurrentTheme } = useTheme();
  const { launchApp } = useApps();

  const styledTheme = useStyledTheme();
  const isLight = styledTheme?.name === 'Light Mode';

  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const lastSoundTimeRef = useRef(0);

  /* ── Audio helpers ── */
  const playTone = (freq, duration = 0.12, type = 'sine', gainMult = 0.12) => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime((volume / 100) * gainMult, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch { /* silent */ }
  };

  const handleVolumeChange = (val) => {
    setVolume(val);
    const now = Date.now();
    if (now - lastSoundTimeRef.current > 150) {
      playTone(520, 0.10, 'sine', 0.12);
      lastSoundTimeRef.current = now;
    }
  };

  const startHacking = () => {
    setIsOpen(false);
    playTone(180, 0.25, 'sawtooth', 0.08);
    launchApp('hackerhub');
  };

  // Sync online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync brightness styling effect
  useEffect(() => {
    const actualBrt = Math.max(40, brightness);
    document.documentElement.style.setProperty('--system-brightness', `${actualBrt}%`);
    return () => {
      document.documentElement.style.removeProperty('--system-brightness');
    };
  }, [brightness]);

  // Handle clicking outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const brtPct = Math.round(((brightness - 40) / 60) * 100);

  return (
    <ControlContainer>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} ref={buttonRef}>
        <StatusTrayButton onClick={() => setIsOpen(o => !o)} aria-label="Wireless Status and Controls">
          <TrayIcon $active={isOnline} $color="#4ade80">
            <i className={`fas fa-${isOnline ? 'wifi' : 'wifi-slash'}`} />
          </TrayIcon>
        </StatusTrayButton>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <DropdownPanel
            ref={containerRef}
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Header */}
            <PanelHeader>
              <PanelTitle>System Info</PanelTitle>
              <StatusDot $online={isOnline}>{isOnline ? 'Online' : 'Offline'}</StatusDot>
            </PanelHeader>

            {/* Connection Info */}
            <SectionCard>
              <DeviceRow>
                <DeviceName $iconColor="#4ade80">
                  <i className="fas fa-wifi" />
                  <span>Amrut_WiFi_5G</span>
                </DeviceName>
                <StatusBadge $type="online">Connected</StatusBadge>
              </DeviceRow>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                <span style={{ fontSize: '0.55rem', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                  Available Networks
                </span>
                
                <ScannerItem onClick={startHacking}>
                  <span style={{ 
                    fontSize: '0.68rem', 
                    color: isLight ? '#15803d' : '#00ff41', 
                    textShadow: isLight ? 'none' : '0 0 3px #00ff4140', 
                    fontFamily: 'monospace', 
                    fontWeight: 'bold' 
                  }}>
                    <i className="fas fa-terminal" style={{ marginRight: '6px' }} />
                    Matrix_Terminal
                  </span>
                  <i className="fas fa-lock" style={{ fontSize: '0.58rem', color: isLight ? '#15803d' : '#00ff41' }} />
                </ScannerItem>

                <ScannerItem disabled>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'monospace' }}>
                    <i className="fas fa-shield-halved" style={{ marginRight: '6px' }} />
                    NSA_Surveillance_04
                  </span>
                  <i className="fas fa-lock" style={{ fontSize: '0.58rem' }} />
                </ScannerItem>

                <ScannerItem disabled>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'monospace' }}>
                    <i className="fas fa-lock" style={{ marginRight: '6px' }} />
                    Neighbor_WiFi_Ext
                  </span>
                  <i className="fas fa-lock" style={{ fontSize: '0.58rem' }} />
                </ScannerItem>
              </div>
            </SectionCard>

            {/* Minimal Sliders */}
            <SectionCard>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Volume Slider */}
                <SliderWrapper>
                  <SliderMeta>
                    <span className="label">
                      <i className="fas fa-volume-high" /> Volume
                    </span>
                    <span className="value">{volume}%</span>
                  </SliderMeta>
                  <ModernSlider
                    type="range"
                    min="0" max="100"
                    value={volume}
                    $pct={volume}
                    onChange={(e) => handleVolumeChange(+e.target.value)}
                  />
                </SliderWrapper>

                {/* Brightness Slider */}
                <SliderWrapper>
                  <SliderMeta>
                    <span className="label">
                      <i className="fas fa-sun" /> Brightness
                    </span>
                    <span className="value">{brightness}%</span>
                  </SliderMeta>
                  <ModernSlider
                    type="range"
                    min="40" max="100"
                    value={brightness}
                    $pct={brtPct}
                    onChange={(e) => setBrightness(+e.target.value)}
                  />
                </SliderWrapper>
              </div>
            </SectionCard>
          </DropdownPanel>
        )}
      </AnimatePresence>
    </ControlContainer>
  );
}
