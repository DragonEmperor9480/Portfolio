/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

/* ─── Keyframe Animations ─────────────────────────────────────────── */

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.85; }
`;

const scanlineAnim = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

const screenShake = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  20% { transform: translate(-4px, 4px) rotate(-0.5deg); }
  40% { transform: translate(4px, -2px) rotate(0.5deg); }
  60% { transform: translate(-2px, -4px) rotate(-0.2deg); }
  80% { transform: translate(4px, 4px) rotate(0.5deg); }
`;

const textScramble = keyframes`
  0%, 100% { filter: none; }
  49% { filter: none; }
  50% { filter: skewX(15deg) blur(1px); color: #00f0ff; }
  52% { filter: skewX(-10deg) blur(0px); color: #ff3366; }
  54% { filter: none; }
`;

/* ─── Styled Components ───────────────────────────────────────────── */

const HUDContainer = styled(motion.div)`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(4, 5, 12, 0.65);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  z-index: 99999999;
  display: grid;
  grid-template-rows: 60px 1fr 60px;
  padding: 24px 40px;
  box-sizing: border-box;
  font-family: 'Fira Code', 'Courier New', monospace;
  color: #ff3366;
  overflow: hidden;
  user-select: none;
`;

const ScanlineOverlay = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    rgba(18, 16, 16, 0) 50%, 
    rgba(0, 0, 0, 0.3) 50%
  );
  background-size: 100% 4px;
  z-index: 9999999;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: rgba(255, 51, 102, 0.15);
    box-shadow: 0 0 10px rgba(255, 51, 102, 0.6);
    animation: ${scanlineAnim} 6s linear infinite;
  }
`;

/* ─── Top Panel ───────────────────────────────────────────────────── */
const HeaderPanel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 51, 102, 0.25);
  padding-bottom: 12px;
  z-index: 10;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 0.8rem;
  font-weight: 700;
`;

const RecIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ff3366;
  
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ff3366;
    box-shadow: 0 0 8px #ff3366;
  }
`;

const HeaderCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const RAMTitle = styled.div`
  font-size: 0.65rem;
  font-weight: bold;
  color: #00f0ff;
  text-shadow: 0 0 5px rgba(0, 240, 255, 0.5);
  letter-spacing: 1px;
`;

const RAMBar = styled.div`
  display: flex;
  gap: 4px;
`;

const RAMSlot = styled.div`
  width: 8px;
  height: 16px;
  border-radius: 1px;
  background: ${props => props.$filled ? '#00f0ff' : 'transparent'};
  border: 1px solid ${props => props.$filled ? '#00f0ff' : 'rgba(0, 240, 255, 0.25)'};
  box-shadow: ${props => props.$filled ? '0 0 6px #00f0ff' : 'none'};
  transition: all 0.2s ease;
`;

const HeaderRight = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  color: #ff3366;
  opacity: 0.85;
  letter-spacing: 0.5px;
`;

/* ─── Grid Core Layout ────────────────────────────────────────────── */
const ViewGrid = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr 340px;
  gap: 30px;
  align-items: center;
  z-index: 5;
  overflow: hidden;
  height: 100%;
`;

/* ─── Left List (Quickhacks) ──────────────────────────────────────── */
const QuickhacksPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 85%;
  justify-content: center;
`;

const PanelSubtitle = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #ff3366;
  letter-spacing: 1px;
  border-left: 3px solid #ff3366;
  padding-left: 8px;
  margin-bottom: 8px;
`;

const QuickhackButton = styled(motion.button)`
  background: ${props => props.$active 
    ? 'linear-gradient(90deg, rgba(255, 51, 102, 0.12) 0%, rgba(255, 51, 102, 0.02) 100%)' 
    : 'rgba(255, 255, 255, 0.01)'};
  border: 1px solid ${props => {
    if (props.$locked) return 'rgba(255, 51, 102, 0.15)';
    return props.$active ? '#ff3366' : 'rgba(255, 51, 102, 0.25)';
  }};
  border-left: 4px solid ${props => {
    if (props.$locked) return '#ff336640';
    return props.$active ? '#ff3366' : 'transparent';
  }};
  border-radius: 4px;
  padding: 10px 14px;
  color: ${props => props.$locked ? '#ff336660' : '#ffffff'};
  text-align: left;
  cursor: ${props => props.$locked ? 'not-allowed' : 'pointer'};
  outline: none;
  font-family: inherit;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  transition: all 0.15s ease;

  .name-block {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .title {
    font-size: 0.76rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    text-shadow: ${props => props.$active ? '0 0 5px rgba(255, 51, 102, 0.5)' : 'none'};
  }

  .status-tag {
    font-size: 0.52rem;
    font-weight: bold;
    color: ${props => props.$locked ? '#ff3366aa' : '#00ff41'};
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .ram-cost {
    font-size: 0.85rem;
    font-weight: 900;
    color: ${props => props.$locked ? '#ff336660' : '#00f0ff'};
    display: flex;
    align-items: center;
    gap: 3px;
    
    i {
      font-size: 0.65rem;
    }
  }
`;

/* ─── Center Display (Scanner Reticle) ────────────────────────────── */
const CenterPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;
`;

const TargetOutline = styled.div`
  width: 280px;
  height: 380px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TargetVector = styled.svg`
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  stroke: #ff3366;
  fill: none;
  filter: drop-shadow(0 0 6px rgba(255, 51, 102, 0.45));
  
  .target-outline {
    stroke-width: 1.5;
    opacity: 0.85;
    animation: ${pulse} 3s ease-in-out infinite;
  }

  .scanning-line {
    stroke-width: 1;
    stroke-dasharray: 4 6;
  }
`;

const ReticleRing = styled.div`
  width: 240px;
  height: 240px;
  border-radius: 50%;
  border: 1px dashed rgba(255, 51, 102, 0.25);
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${spin} 20s linear infinite;

  &::before {
    content: '';
    width: 200px;
    height: 200px;
    border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: #ff3366;
    border-bottom-color: #ff3366;
    position: absolute;
    animation: ${spin} 8s linear infinite reverse;
    opacity: 0.6;
  }
`;

const TargetHeader = styled.div`
  position: absolute;
  top: 10%;
  text-align: center;
  font-family: inherit;
  color: #ff3366;
  font-size: 0.72rem;
  font-weight: 700;
  background: rgba(4, 5, 12, 0.8);
  border: 1px solid rgba(255, 51, 102, 0.3);
  padding: 4px 10px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

  .caret {
    color: #ff3366;
    margin-right: 4px;
    font-size: 0.65rem;
    animation: ${pulse} 1s infinite;
  }
`;

/* ─── Right Details (Stats Card) ──────────────────────────────────── */
const SpecsPanel = styled.div`
  border: 1px solid rgba(255, 51, 102, 0.35);
  background: rgba(4, 5, 12, 0.85);
  box-shadow: 0 0 15px rgba(255, 51, 102, 0.05);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 85%;
  justify-content: flex-start;
  box-sizing: border-box;
`;

const TabsRow = styled.div`
  display: flex;
  gap: 14px;
  border-bottom: 1px solid rgba(255, 51, 102, 0.25);
  padding-bottom: 6px;
`;

const TabItem = styled.span`
  font-size: 0.72rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${props => props.$active ? '#ff3366' : 'rgba(255, 51, 102, 0.45)'};
  border-bottom: 2px solid ${props => props.$active ? '#ff3366' : 'transparent'};
  padding-bottom: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const SpecsHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  .name {
    font-size: 0.95rem;
    font-weight: 800;
    color: #ffffff;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
  }

  .category {
    font-size: 0.58rem;
    font-weight: 700;
    color: #00f0ff;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }
`;

const SpecsStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: rgba(255, 51, 102, 0.04);
  border: 1px solid rgba(255, 51, 102, 0.15);
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.68rem;

  .stat-row {
    display: flex;
    justify-content: space-between;
    color: rgba(255, 255, 255, 0.7);
    
    span:last-child {
      font-weight: bold;
      color: #ffffff;
    }
  }
`;

const SpecDescription = styled.ul`
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.5;
  padding-left: 14px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;

  li {
    list-style-type: square;
    
    &::marker {
      color: #ff3366;
    }
  }
`;

const SpecsFooter = styled.div`
  margin-top: auto;
  border-top: 1px solid rgba(255, 51, 102, 0.15);
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SpecsExecuteBtn = styled(motion.button)`
  background: #ff3366;
  border: none;
  border-radius: 4px;
  padding: 10px;
  color: #040711;
  font-family: inherit;
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(255, 51, 102, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  outline: none;

  &:hover {
    background: #ff5588;
    box-shadow: 0 0 14px rgba(255, 51, 102, 0.55);
  }
`;

/* ─── Bottom Status ───────────────────────────────────────────────── */
const FooterPanel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 51, 102, 0.25);
  padding-top: 12px;
  font-size: 0.68rem;
  font-weight: 700;
  z-index: 10;
`;

const LegendItem = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 51, 102, 0.85);

  .key {
    background: #ff3366;
    color: #040711;
    padding: 1px 6px;
    border-radius: 3px;
    font-size: 0.62rem;
    font-weight: 900;
  }
`;

/* ─── Glitch Overlay Screen ───────────────────────────────────────── */
const UploadOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(4, 5, 12, 0.85);
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  
  .label {
    font-size: 0.85rem;
    font-weight: bold;
    color: #00f0ff;
    text-shadow: 0 0 5px #00f0ff80;
    text-transform: uppercase;
  }

  .bar {
    width: 200px;
    height: 6px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(0, 240, 255, 0.3);
    border-radius: 3px;
    overflow: hidden;
  }

  .fill {
    height: 100%;
    background: #00f0ff;
    box-shadow: 0 0 8px #00f0ff;
  }
`;

/* ─── Glitch Visual Screen Wrapper (Full Screen Shock) ───────────── */
const FullScreenGlitchEffect = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99999999;
  pointer-events: none;
  
  &.$blackout {
    background: #000000;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-family: monospace;
    font-size: 0.9rem;
    letter-spacing: 2px;
    animation: ${pulse} 1.5s infinite;
  }

  &.$shock {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: invert(10%);
    animation: ${screenShake} 0.3s ease infinite, ${textScramble} 0.2s ease infinite;
    box-shadow: inset 0 0 100px rgba(0, 240, 255, 0.4);
  }

  &.$malfunction {
    background: rgba(0, 255, 65, 0.02);
    animation: ${textScramble} 0.8s ease infinite;
  }
`;

/* ─── BSOD Crash Screen ───────────────────────────────────────────── */
const CrashScreen = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: #0010aa;
  color: #ffffff;
  z-index: 999999999;
  font-family: 'Courier New', monospace;
  padding: 80px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 30px;
  line-height: 1.5;
  text-align: left;

  .face {
    font-size: 8rem;
    font-weight: 300;
    line-height: 1;
  }

  .title {
    font-size: 1.6rem;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .reboot-btn {
    align-self: flex-start;
    background: #ffffff;
    color: #0010aa;
    border: none;
    font-family: inherit;
    font-size: 0.9rem;
    font-weight: bold;
    padding: 10px 24px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 30px;
    transition: all 0.2s ease;

    &:hover {
      background: #e6e6e6;
      box-shadow: 0 0 15px rgba(255,255,255,0.4);
    }
  }
`;

/* ─── Component Code ──────────────────────────────────────────────── */

const QUICKHACKS_DATA = [
  {
    id: 'reboot_optics',
    title: 'Reboot Optics',
    category: 'Control Quickhack',
    ram: 6,
    status: 'Ready',
    traceable: true,
    damageType: 'Deafening / Blinding',
    duration: '3.0 sec',
    upload: '1.5 sec',
    desc: [
      'Resets targeted optic modules, completely blinding optical receptors.',
      'Triggers a full viewport blackout on the portfolio site.',
      'Clears active tracking indicators and hides site navigation.',
    ]
  },
  {
    id: 'sonic_shock',
    title: 'Sonic Shock',
    category: 'Control Quickhack',
    ram: 5,
    status: 'Ready',
    traceable: false,
    damageType: 'Acoustic Malfunction',
    duration: '4.0 sec',
    upload: '1.0 sec',
    desc: [
      'Deafens target, preventing communication of threat levels.',
      'Shuts off all active background sound chimes and navbar player audio.',
      'Isolates local site sensors, executing in complete stealth.',
    ]
  },
  {
    id: 'synapse_burnout',
    title: 'Synapse Burnout',
    category: 'Combat Quickhack',
    ram: 16,
    status: 'Ready',
    traceable: true,
    damageType: '164 Physical Damage',
    duration: '7.5 sec',
    upload: '3.0 sec',
    desc: [
      'Deals physical damage that scales higher with spent RAM.',
      'Forces synaptic circuits to overheat, causing heavy glitch ripples.',
      'Increases overload thresholds, generating flashing color noise alerts.',
    ]
  },
  {
    id: 'short_circuit',
    title: 'Short Circuit',
    category: 'Combat Quickhack',
    ram: 10,
    status: 'Ready',
    traceable: false,
    damageType: 'Electrostatic Shock',
    duration: '1.5 sec',
    upload: '2.0 sec',
    desc: [
      'Discharges electrical load into targeted hardware components.',
      'Triggers a violent CSS screen-shaking and glitch distortion ripple.',
      'Deals critical damage to layout alignments, centering indices.',
    ]
  },
  {
    id: 'cyberware_malfunction',
    title: 'Cyberware Malfunction',
    category: 'Control Quickhack',
    ram: 3,
    status: 'Ready',
    traceable: true,
    damageType: 'System Scramble',
    duration: '5.0 sec',
    upload: '1.0 sec',
    desc: [
      'Disables cyberware implants, scrambling targeted text drivers.',
      'Causes all portfolio heading text to scramble into random characters.',
      'Reduces armor attributes, making grid panels semi-transparent.',
    ]
  },
  {
    id: 'matrix_override',
    title: 'Matrix Override',
    category: 'System Hack',
    ram: 24,
    status: 'Ready',
    traceable: true,
    damageType: 'Core Theme Hijack',
    duration: 'Permanent',
    upload: '2.5 sec',
    desc: [
      'Bypasses core styling modules, injecting matrix shell scripts.',
      'Overrides current design themes, painting the interface in neon green.',
      'Establishes permanent root control access on the portfolio node.',
    ]
  },
  {
    id: 'memory_wipe',
    title: 'Memory Wipe',
    category: 'Covert Quickhack',
    ram: 31,
    status: 'Insufficient RAM',
    traceable: false,
    damageType: 'System Lock',
    duration: 'N/A',
    upload: 'N/A',
    desc: [
      'Forces target to exit active alert states, wiping sensor logs.',
      'Requires 31 RAM. Current cyberdeck RAM levels insufficient.',
    ],
    locked: true
  },
  {
    id: 'system_collapse',
    title: 'System Collapse',
    category: 'Ultimate Quickhack',
    ram: 28,
    status: 'Insufficient RAM',
    traceable: true,
    damageType: 'Kernel Panic',
    duration: 'Permanent',
    upload: '4.0 sec',
    desc: [
      'Crashes targeted system drivers, forcing kernel shutoff.',
      'Triggers a blue screen of death crash simulation on the viewport.',
      'Can only be run with ultimate RAM level upgrades.',
    ],
    locked: true // We will unlock system collapse for gameplay fun if they have over 28 RAM, but initially locked
  }
];

export default function HackingHUD({ onClose, onOverrideSuccess }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [ramValue] = useState(26); // 26 / 27 blocks filled
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [activeEffect, setActiveEffect] = useState(null); // 'blackout' | 'shock' | 'malfunction' | 'bsod'
  const [sysCollapseUnlocked, setSysCollapseUnlocked] = useState(false);

  const activeHack = sysCollapseUnlocked && selectedIdx === 7
    ? { ...QUICKHACKS_DATA[7], locked: false, status: 'Ready' }
    : QUICKHACKS_DATA[selectedIdx];

  // Synthesize Web Audio API sound tones
  const playTone = (freq, duration = 0.12, type = 'sine', gainMult = 0.1) => {
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
      gain.gain.setValueAtTime(gainMult, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch { /* silent */ }
  };

  const playHoverSound = () => playTone(1200, 0.04, 'sine', 0.02);
  const playSelectSound = () => {
    playTone(1600, 0.03, 'sine', 0.03);
    setTimeout(() => playTone(1900, 0.04, 'sine', 0.03), 40);
  };
  const playExecuteSound = () => {
    playTone(800, 0.15, 'sawtooth', 0.05);
    setTimeout(() => playTone(1200, 0.2, 'sine', 0.05), 100);
  };
  const playUploadSuccessSound = () => {
    playTone(523.25, 0.08, 'sine', 0.08); // C5
    setTimeout(() => playTone(659.25, 0.08, 'sine', 0.08), 80); // E5
    setTimeout(() => playTone(783.99, 0.08, 'sine', 0.08), 160); // G5
    setTimeout(() => playTone(1046.50, 0.18, 'sine', 0.08), 240); // C6
  };
  const playVictory = playUploadSuccessSound;
  const playGlitchSound = () => {
    playTone(120, 0.25, 'sawtooth', 0.12);
  };

  // Keyboard navigation & execution
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isUploading || activeEffect) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIdx(prev => (prev + 1) % QUICKHACKS_DATA.length);
        playHoverSound();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIdx(prev => (prev - 1 + QUICKHACKS_DATA.length) % QUICKHACKS_DATA.length);
        playHoverSound();
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        handleExecute();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIdx, isUploading, activeEffect, sysCollapseUnlocked]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle upload progress bar
  const handleExecute = () => {
    if (activeHack.locked) {
      playTone(180, 0.25, 'sawtooth', 0.15); // buzz
      return;
    }
    playExecuteSound();
    setIsUploading(true);
    setUploadPct(0);
  };

  useEffect(() => {
    if (!isUploading) return;
    let frameId;
    let start = performance.now();
    const duration = 2000; // 2 seconds fake upload

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setUploadPct(Math.round(progress));

      if (progress >= 100) {
        setIsUploading(false);
        triggerHackEffect();
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isUploading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Visual quickhack triggers
  const triggerHackEffect = () => {
    playUploadSuccessSound();
    const hackId = activeHack.id;

    if (hackId === 'matrix_override') {
      onOverrideSuccess(); // switch theme to Matrix
      // Show success feedback
      setActiveEffect('success');
      setTimeout(() => setActiveEffect(null), 3000);
    } else if (hackId === 'reboot_optics') {
      setActiveEffect('blackout');
      setTimeout(() => setActiveEffect(null), 3500);
    } else if (hackId === 'short_circuit') {
      playGlitchSound();
      setActiveEffect('shock');
      setTimeout(() => setActiveEffect(null), 1800);
    } else if (hackId === 'cyberware_malfunction') {
      playGlitchSound();
      setActiveEffect('malfunction');
      // Apply body level text scramble class
      document.body.classList.add('cyberdeck-malfunction');
      setTimeout(() => {
        document.body.classList.remove('cyberdeck-malfunction');
        setActiveEffect(null);
      }, 5000);
    } else if (hackId === 'sonic_shock') {
      // Toggle a sound mute effect or play a damp blip
      setActiveEffect('success');
      setTimeout(() => setActiveEffect(null), 2000);
    } else if (hackId === 'system_collapse') {
      setActiveEffect('bsod');
    }
  };

  // Hack selection click
  const selectHack = (idx) => {
    if (isUploading || activeEffect) return;
    setSelectedIdx(idx);
    playSelectSound();
  };

  // Unlocks Ultimate quickhack System Collapse by tapping Cyberdeck RAM
  const triggerRamUpgrade = () => {
    if (sysCollapseUnlocked) return;
    playVictory();
    setSysCollapseUnlocked(true);
  };

  const hudContent = (
    <>
      <HUDContainer
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.35 }}
      >
        <ScanlineOverlay />

        {/* ── Top Header Bar ── */}
        <HeaderPanel>
          <HeaderLeft>
            <span style={{ color: '#ffffff' }}>TIME 02:13:53</span>
            <RecIndicator>
              <motion.div 
                className="dot" 
                animate={{ opacity: [1, 0, 1] }} 
                transition={{ repeat: Infinity, duration: 1 }}
              />
              <span>REC</span>
            </RecIndicator>
            <span style={{ opacity: 0.6 }}>HD  F 5.6  ISO 100</span>
          </HeaderLeft>

          <HeaderCenter>
            <RAMTitle onClick={triggerRamUpgrade} style={{ cursor: 'pointer' }}>
              CYBERDECK RAM: {sysCollapseUnlocked ? '27/27' : '26/27'}
            </RAMTitle>
            <RAMBar>
              {Array.from({ length: 27 }).map((_, i) => (
                <RAMSlot 
                  key={i} 
                  $filled={i < (sysCollapseUnlocked ? 27 : ramValue)} 
                />
              ))}
            </RAMBar>
          </HeaderCenter>

          <HeaderRight>
            <i className="fas fa-bolt" style={{ color: '#00f0ff', marginRight: '5px' }} />
            <span>POWER CONNECTED</span>
            <span style={{ opacity: 0.5, marginLeft: '12px' }}>CAMERA 04</span>
          </HeaderRight>
        </HeaderPanel>

        {/* ── Main View Grid ── */}
        <ViewGrid>
          {/* Left panel (Quickhacks) */}
          <QuickhacksPanel>
            <PanelSubtitle>Available Quickhacks</PanelSubtitle>
            {QUICKHACKS_DATA.map((h, i) => {
              const currentActive = i === selectedIdx;
              const isLocked = h.locked && !(sysCollapseUnlocked && i === 7);
              
              return (
                <QuickhackButton
                  key={h.id}
                  $active={currentActive}
                  $locked={isLocked}
                  onClick={() => selectHack(i)}
                  whileHover={!isLocked ? { scale: 1.02, x: 4 } : {}}
                  whileTap={!isLocked ? { scale: 0.98 } : {}}
                >
                  <div className="name-block">
                    <span className="title">{h.title}</span>
                    <span className="status-tag">{isLocked ? 'INSUFFICIENT RAM' : 'READY'}</span>
                  </div>
                  <div className="ram-cost">
                    {h.ram}
                    <i className="fas fa-microchip" />
                  </div>
                </QuickhackButton>
              );
            })}
          </QuickhacksPanel>

          {/* Center scan area */}
          <CenterPanel>
            <TargetHeader>
              <i className="fas fa-caret-down caret" />
              <span>AMRUTESH NAREGAL // FULL-STACK DEV</span>
            </TargetHeader>
            <TargetOutline>
              <ReticleRing />
              <TargetVector viewBox="0 0 280 380">
                {/* Neon silhouette vector */}
                <path 
                  className="target-outline"
                  d="M140 30 C155 30 165 42 165 58 C165 74 155 86 140 86 C125 86 115 74 115 58 C115 42 125 30 140 30 Z M115 88 L165 88 L185 130 C190 140 180 160 170 160 L165 160 L165 250 L180 350 L145 350 L140 270 L135 350 L100 350 L115 250 L115 160 L110 160 C100 160 90 140 95 130 Z" 
                />
                {/* Horizontal scanner trace bar */}
                <line className="scanning-line" x1="20" y1="190" x2="260" y2="190" />
                {/* Reticle corner ticks */}
                <path d="M 10 10 L 30 10 M 10 10 L 10 30" strokeWidth="2.5" />
                <path d="M 270 10 L 250 10 M 270 10 L 270 30" strokeWidth="2.5" />
                <path d="M 10 370 L 30 370 M 10 370 L 10 350" strokeWidth="2.5" />
                <path d="M 270 370 L 250 370 M 270 370 L 270 350" strokeWidth="2.5" />
              </TargetVector>
            </TargetOutline>
            
            {/* Telemetry metadata overlay */}
            <div style={{ position: 'absolute', bottom: '15%', fontSize: '0.62rem', color: '#ff3366', opacity: 0.75, display: 'flex', flexDirection: 'column', gap: '3px', border: '1px solid rgba(255,51,102,0.15)', padding: '6px 12px', background: 'rgba(0,0,0,0.4)', borderRadius: '4px' }}>
              <div>HP: 100/100</div>
              <div>LOC: BENGALURU, IN</div>
              <div>LEVEL: 42</div>
            </div>

            {/* Fake progress bar overlay during executing uploads */}
            {isUploading && (
              <UploadOverlay>
                <div className="label">Uploading quickhack: {uploadPct}%</div>
                <div className="bar">
                  <div className="fill" style={{ width: `${uploadPct}%` }} />
                </div>
              </UploadOverlay>
            )}
          </CenterPanel>

          {/* Right panel (Specifications/Stats) */}
          <SpecsPanel>
            <TabsRow>
              <TabItem>Data [Z]</TabItem>
              <TabItem $active={true}>Hacking</TabItem>
            </TabsRow>

            <SpecsHeader>
              <span className="name">{activeHack.title}</span>
              <span className="category">{activeHack.category}</span>
            </SpecsHeader>

            <SpecsStats>
              <div className="stat-row">
                <span>RAM Cost</span>
                <span>{activeHack.ram}</span>
              </div>
              <div className="stat-row">
                <span>Upload Time</span>
                <span>{activeHack.upload}</span>
              </div>
              <div className="stat-row">
                <span>Duration</span>
                <span>{activeHack.duration}</span>
              </div>
              <div className="stat-row">
                <span>Damage Type</span>
                <span style={{ color: activeHack.locked ? '#ff3366' : '#00ff41' }}>{activeHack.damageType}</span>
              </div>
            </SpecsStats>

            <SpecDescription>
              {activeHack.desc.map((d, index) => (
                <li key={index}>{d}</li>
              ))}
            </SpecDescription>

            <SpecsFooter>
              <SpecsExecuteBtn
                onClick={handleExecute}
                disabled={activeHack.locked || isUploading}
                whileHover={!activeHack.locked && !isUploading ? { scale: 1.03 } : {}}
                whileTap={!activeHack.locked && !isUploading ? { scale: 0.97 } : {}}
                style={{ opacity: activeHack.locked ? 0.45 : 1 }}
              >
                <i className="fas fa-terminal" />
                <span>[F] Execute Hack</span>
              </SpecsExecuteBtn>
            </SpecsFooter>
          </SpecsPanel>
        </ViewGrid>

        {/* ── Bottom Controls Legend Bar ── */}
        <FooterPanel>
          <LegendItem>
            <span className="key">F</span>
            <span>Execute Quickhack</span>
          </LegendItem>
          <LegendItem>
            <span className="key">↑ ↓</span>
            <span>Change Target Hack</span>
          </LegendItem>
          <LegendItem>
            <span className="key">Esc</span>
            <span>Exit Optical Scanner</span>
          </LegendItem>
          <span style={{ opacity: 0.5 }}>KIROSHI OPTICAL SYSTEMS V1.4</span>
        </FooterPanel>
      </HUDContainer>

      {/* Full screen visual overrides */}
      {activeEffect === 'blackout' && (
        <FullScreenGlitchEffect className="$blackout">
          <span>REBOOTING OPTICAL IMPLANTS...</span>
        </FullScreenGlitchEffect>
      )}

      {activeEffect === 'shock' && (
        <FullScreenGlitchEffect className="$shock" />
      )}

      {activeEffect === 'malfunction' && (
        <FullScreenGlitchEffect className="$malfunction" />
      )}

      {activeEffect === 'success' && (
        <FullScreenGlitchEffect className="$blackout" style={{ background: 'rgba(0, 255, 65, 0.08)' }}>
          <span style={{ color: '#00ff41', textShadow: '0 0 10px #00ff41' }}>OVERRIDE APPLIED SUCCESSFULLY</span>
        </FullScreenGlitchEffect>
      )}

      {/* BSOD Crash overlay */}
      {activeEffect === 'bsod' && (
        <CrashScreen>
          <div className="face">:(</div>
          <div className="title">Your cyberdeck ran into a critical exception and needs to reboot.</div>
          <div>We&apos;re just collecting some error telemetry, and then we&apos;ll reboot for you. (100% complete)</div>
          <div style={{ marginTop: '10px', opacity: 0.7, fontSize: '0.9rem' }}>
            If you call a support agent, give them this info:<br />
            Stop Code: KERNEL_PANIC_RAM_OVERFLOW<br />
            Failure: system_collapse.exe
          </div>
          <button 
            className="reboot-btn" 
            onClick={() => {
              playVictory();
              window.location.reload();
            }}
          >
            Reboot Cyberdeck
          </button>
        </CrashScreen>
      )}
    </>
  );

  return typeof document !== 'undefined' ? createPortal(hudContent, document.body) : hudContent;
}
