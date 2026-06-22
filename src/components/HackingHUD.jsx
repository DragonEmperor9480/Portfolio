'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
// Assets served from /public — no import needed in Next.js
const adamModelUrl = '/adam_smasher.glb';
const hitSoundUrl = '/hit-sound.mp3';
const deathSoundUrl = '/death-sound.mp3';
import ModelViewer from './ui/ModelViewer';


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
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.72rem;
  font-weight: 700;
  color: #ff3366;
  opacity: 0.85;
  letter-spacing: 0.5px;
`;

const CloseHUDButton = styled(motion.button)`
  background: transparent;
  border: 1px solid rgba(255, 51, 102, 0.4);
  color: #ff3366;
  padding: 6px 12px;
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.65rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  box-shadow: 0 0 8px rgba(255, 51, 102, 0.1);
  outline: none;

  &:hover {
    background: rgba(255, 51, 102, 0.12);
    border-color: #ff3366;
    color: #ffffff;
    box-shadow: 0 0 12px rgba(255, 51, 102, 0.4);
  }
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
  width: 360px;
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

/* ─── Terminal Logger Console ────────────────────────────────────────── */
const TerminalLogBox = styled.div`
  position: absolute;
  bottom: 4%;
  left: 5%;
  right: 5%;
  height: 90px;
  background: rgba(4, 5, 12, 0.75);
  border: 1px solid rgba(255, 51, 102, 0.25);
  border-radius: 6px;
  padding: 8px 12px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: 0 4px 15px rgba(255, 51, 102, 0.08);
  backdrop-filter: blur(8px);
  z-index: 10;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 51, 102, 0.3);
    border-radius: 2px;
  }
`;

const LogLine = styled.div`
  line-height: 1.4;
  white-space: pre-wrap;
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 0.55rem;
  letter-spacing: 0.5px;
  text-align: left;
  
  color: ${props => {
    if (props.$type === 'system') return '#00f0ff';
    if (props.$type === 'exe') return '#eab308';
    if (props.$type === 'success') return '#00ff41';
    return '#ff668c'; // quotes/dialogue
  }};
  
  &::before {
    content: '> ';
    opacity: 0.5;
  }
`;

/* ─── Cyberpunk Alert Popup Modal ────────────────────────────────────── */
const AlertPopup = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(90%, 540px);
  background: rgba(8, 4, 16, 0.96);
  border: 1px solid #ff3366;
  border-left: 5px solid #ff3366;
  border-radius: 8px;
  box-shadow: 
    0 24px 60px rgba(0, 0, 0, 0.9),
    0 0 30px rgba(255, 51, 102, 0.45),
    0 0 35px rgba(255, 51, 102, 0.15) inset;
  padding: 24px 30px;
  color: #ffffff;
  z-index: 100000;
  font-family: 'Fira Code', 'Courier New', monospace;
  box-sizing: border-box;
  overflow: hidden;
  backdrop-filter: blur(20px);

  /* Scanline matrix overlay */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      rgba(255, 51, 102, 0) 50%, 
      rgba(255, 51, 102, 0.12) 50%
    );
    background-size: 100% 4px;
    pointer-events: none;
    z-index: 2;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 51, 102, 0.3);
    padding-bottom: 10px;
    margin-bottom: 18px;
    font-size: 0.68rem;
    font-weight: 800;
    color: #ff3366;
    letter-spacing: 3px;
    text-transform: uppercase;

    .icon {
      color: #ff3366;
      animation: alertPulse 1.2s infinite alternate;
    }
  }

  .quote-content {
    font-size: 0.88rem;
    line-height: 1.6;
    color: #00f0ff;
    text-shadow: 0 0 8px rgba(0, 240, 255, 0.5);
    white-space: pre-wrap;
    text-align: center;
    font-weight: 500;
    letter-spacing: 0.5px;
  }

  @keyframes alertPulse {
    0% { opacity: 0.3; transform: scale(0.95); }
    100% { opacity: 1; transform: scale(1.05); }
  }
`;

const AlertButton = styled(motion.button)`
  background: transparent;
  border: 1px solid #ff3366;
  border-radius: 4px;
  color: #ff3366;
  padding: 8px 24px;
  font-family: inherit;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.2s ease;
  box-shadow: 0 0 10px rgba(255, 51, 102, 0.15);

  &:hover {
    background: rgba(255, 51, 102, 0.12);
    box-shadow: 0 0 20px rgba(255, 51, 102, 0.45);
    border-color: #ff3366;
    color: #ffffff;
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

const ResolutionWarningScreen = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(8, 4, 16, 0.98);
  color: #ff3366;
  z-index: 999999999;
  font-family: 'Fira Code', 'Courier New', monospace;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  box-sizing: border-box;
  text-align: center;
  gap: 20px;
  backdrop-filter: blur(20px);

  /* Scanline overlay */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      rgba(255, 51, 102, 0) 50%, 
      rgba(255, 51, 102, 0.12) 50%
    );
    background-size: 100% 4px;
    pointer-events: none;
    z-index: 2;
  }

  .warning-icon {
    font-size: 3.5rem;
    color: #ff3366;
    animation: alertPulse 1.2s infinite alternate;
    margin-bottom: 5px;
    filter: drop-shadow(0 0 10px rgba(255, 51, 102, 0.6));
  }

  .title {
    font-size: 1.4rem;
    font-weight: 800;
    letter-spacing: 3px;
    text-transform: uppercase;
    text-shadow: 0 0 10px rgba(255, 51, 102, 0.5);
  }

  .message {
    font-size: 0.82rem;
    line-height: 1.6;
    color: #ffffff;
    max-width: 580px;
    opacity: 0.9;
  }

  .dimensions-box {
    font-size: 0.88rem;
    color: #00f0ff;
    text-shadow: 0 0 8px rgba(0, 240, 255, 0.5);
    font-weight: bold;
    border: 1px dashed rgba(0, 240, 255, 0.3);
    padding: 8px 16px;
    border-radius: 4px;
    background: rgba(0, 240, 255, 0.05);
    margin: 10px 0;
  }

  .button-group {
    display: flex;
    gap: 16px;
    margin-top: 15px;
    z-index: 10;
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
    damage: 20,
    duration: '3.0 sec',
    upload: '1.5 sec',
    desc: [
      'Resets targeted optic modules, completely blinding optical receptors.',
      'Deals 20 damage on upload success.',
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
    damage: 15,
    duration: '4.0 sec',
    upload: '1.0 sec',
    desc: [
      'Deafens target, preventing communication of threat levels.',
      'Deals 15 damage on upload success.',
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
    damage: 45,
    duration: '7.5 sec',
    upload: '3.0 sec',
    desc: [
      'Forces synaptic circuits to overheat, causing heavy glitch ripples.',
      'Deals 45 damage on upload success (scales with RAM cost).',
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
    damage: 30,
    duration: '1.5 sec',
    upload: '2.0 sec',
    desc: [
      'Discharges electrical load into targeted hardware components.',
      'Deals 30 damage on upload success.',
      'Triggers a violent CSS screen-shaking and glitch distortion ripple.',
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
    damage: 10,
    duration: '5.0 sec',
    upload: '1.0 sec',
    desc: [
      'Disables cyberware implants, scrambling targeted text drivers.',
      'Deals 10 damage on upload success.',
      'Causes all portfolio heading text to scramble into random characters.',
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
    damage: 75,
    duration: 'Permanent',
    upload: '2.5 sec',
    desc: [
      'Bypasses core styling modules, injecting matrix shell scripts.',
      'Deals 75 damage on upload success.',
      'Overrides current design themes, painting the interface in neon green.',
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
    damage: 100,
    duration: 'N/A',
    upload: 'N/A',
    desc: [
      'Forces target to exit active alert states, wiping sensor logs.',
      'Deals 100 damage on upload success.',
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
    damage: 100,
    duration: 'Permanent',
    upload: '4.0 sec',
    desc: [
      'Crashes targeted system drivers, forcing kernel shutoff.',
      'Deals 100 damage on upload success (instant defeat).',
      'Triggers a blue screen of death crash simulation on the viewport.',
    ],
    locked: true // We will unlock system collapse for gameplay fun if they have over 28 RAM, but initially locked
  }
];

const GAME_QUOTES = [
  'Nothing is True, Everything is Permitted.',
  'Grace: Are you fine?\nLeon: Me? Feel like a million bucks.',
  'Wake up, Samurai. We have a city to burn.',
  'War... war never changes.',
  'A man chooses, a slave obeys.',
  'What is a man? A miserable little pile of secrets!',
  'The right man in the wrong place can make all the difference in the world.',
  'Protocol 3: I will not lose another Pilot.',
  'Kept you waiting, huh?',
  "It's time to kick ass and chew bubble gum... and I'm all out of gum.",
  'Snake? Snake? SNAAAAAAAKE!',
  'The cake is a lie.',
  'Praise the Sun!'
];



export default function HackingHUD({ onClose, onOverrideSuccess }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [ramValue, setRamValue] = useState(26); // Current active RAM slots
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [activeEffect, setActiveEffect] = useState(null); // 'blackout' | 'shock' | 'malfunction' | 'bsod'
  const [sysCollapseUnlocked, setSysCollapseUnlocked] = useState(false);
  const [targetHp, setTargetHp] = useState(100);
  const [damageFlash, setDamageFlash] = useState(false);

  // Viewport dimensions warning state
  const [dimensions, setDimensions] = useState({ width: 1200, height: 700 });
  const [isLowResolution, setIsLowResolution] = useState(false);
  const [forceConnect, setForceConnect] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
      setIsLowResolution(window.innerWidth < 1200 || window.innerHeight < 700);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Terminal logs state
  const [logs, setLogs] = useState([
    { id: '1', type: 'system', text: '[SYSTEM] OPTICAL SCANNER INTERFACE ACTIVE (v1.4)...' },
    { id: '2', type: 'system', text: '[SYSTEM] ACCESSING LOCAL CYBERDECK SUITE...' },
    { id: '3', type: 'system', text: '[SYSTEM] RAM CAALLOCATION NOMINAL. DECK READY.' }
  ]);
  const logEndRef = useRef(null);
  const hitAudioRef = useRef(null);
  const deathAudioRef = useRef(null);

  // Preload sounds immediately on HUD open to eliminate playback latency
  useEffect(() => {
    const hit = new Audio(hitSoundUrl);
    hit.volume = 0.45;
    hit.load();
    hitAudioRef.current = hit;

    const death = new Audio(deathSoundUrl);
    death.volume = 0.45;
    death.load();
    deathAudioRef.current = death;
  }, []);
  
  // Alert popup states
  const [popupQuote, setPopupQuote] = useState(null);

  // Auto-scroll logs to bottom
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Regenerate RAM over time (1 RAM per 1.5 seconds)
  useEffect(() => {
    const maxRam = sysCollapseUnlocked ? 30 : 26;
    const interval = setInterval(() => {
      setRamValue(prev => {
        if (prev < maxRam) return prev + 1;
        return prev;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [sysCollapseUnlocked]);

  // Handler for custom animation / styling overrides based on active hacks
  const handleHUDAnimate = (model, group, elapsed) => {
    let activeColor = 0xffffff; // default white (preserves original GLB textures/colors)
    let opacity = 1.0;

    if (targetHp === 0) {
      // Target Defeated / Offline - heavy flickering, static dark/malfunctioning red color
      const offlineColors = [0x550011, 0x990022, 0xff3366, 0x000000];
      const strobeIdx = Math.floor(elapsed * 15) % offlineColors.length;
      activeColor = offlineColors[strobeIdx];
      opacity = Math.sin(elapsed * 8) > -0.2 ? 0.25 : 0.05;
    } else if (damageFlash) {
      // Strobe fast between neon pink, cyan, green and white on impact
      const flashColors = [0xff3366, 0x00f0ff, 0x00ff41, 0xffffff];
      const flashIdx = Math.floor(elapsed * 45) % flashColors.length;
      activeColor = flashColors[flashIdx];
      opacity = Math.sin(elapsed * 60) > 0 ? 0.95 : 0.3;
    } else if (activeEffect === 'success') {
      activeColor = 0x00ff41; // Matrix green
    } else if (activeEffect === 'shock') {
      // Fast warning strobe effect
      activeColor = Math.sin(elapsed * 35) > 0 ? 0xeab308 : 0xff3366;
    } else if (activeEffect === 'malfunction') {
      // Glitched outline transparency + malfunction tint
      opacity = Math.sin(elapsed * 25) > 0 ? 0.9 : 0.12;
      activeColor = 0xff3366;
    } else if (activeEffect === 'blackout') {
      opacity = 0;
    } else if (activeEffect === 'bsod') {
      activeColor = 0x00f0ff; // kernel panic cyan
    }

    model.traverse((child) => {
      if (child.isMesh && child.material) {
        const applyProps = (mat) => {
          if (mat.color) mat.color.setHex(activeColor);
          mat.opacity = opacity;
          mat.transparent = opacity < 1.0;
        };

        if (Array.isArray(child.material)) {
          child.material.forEach(applyProps);
        } else {
          applyProps(child.material);
        }
      }
    });
  };

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

  const playSoundEffect = (url) => {
    try {
      const ref = url === hitSoundUrl ? hitAudioRef : deathAudioRef;
      if (ref.current) {
        ref.current.currentTime = 0;
        ref.current.play().catch(() => {});
      } else {
        // Fallback if ref not ready
        const audio = new Audio(url);
        audio.volume = 0.45;
        audio.play().catch(() => {});
      }
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
    if (activeHack.locked || isUploading || ramValue < activeHack.ram) {
      playTone(180, 0.25, 'sawtooth', 0.15); // buzz for locked or insufficient RAM
      return;
    }
    setRamValue(prev => Math.max(0, prev - activeHack.ram));

    // Add execution log
    setLogs(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        type: 'exe',
        text: `[EXE] DEPLOYING ${activeHack.title.toUpperCase()} (COST: ${activeHack.ram} RAM)...`
      }
    ]);

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
    const hackId = activeHack.id;
    const dmg = activeHack.damage || 20;

    // Pick a random quote
    const randomQuote = GAME_QUOTES[Math.floor(Math.random() * GAME_QUOTES.length)];

    const nextHp = Math.max(0, targetHp - dmg);
    if (nextHp === 0) {
      playSoundEffect(deathSoundUrl);
    } else {
      playSoundEffect(hitSoundUrl);
    }

    setTargetHp(prev => {
      const newHp = Math.max(0, prev - dmg);

      // Append logs
      setLogs(logPrev => {
        const updatedLogs = [
          ...logPrev,
          {
            id: Math.random().toString(),
            type: 'success',
            text: `[SUCCESS] ${activeHack.title.toUpperCase()} DEPLOYED SUCCESSFULLY.`
          },
          {
            id: Math.random().toString(),
            type: 'exe',
            text: `[DAMAGE] SCAN TARGET IMPACT: -${dmg} HP (HP: ${newHp}/100)`
          }
        ];

        // If target HP reached 0, trigger victory sequence logs
        if (newHp === 0) {
          updatedLogs.push({
            id: Math.random().toString(),
            type: 'system',
            text: `[SYSTEM] TARGET DEFEATED. DECRYPTING DATA STREAM...`
          });

          randomQuote.split('\n').forEach((line, idx) => {
            updatedLogs.push({
              id: `${Math.random()}-${idx}`,
              type: 'quote',
              text: line.startsWith('Grace:') || line.startsWith('Leon:') ? `[COMM] ${line}` : `[DECRYPTED] "${line}"`
            });
          });
        }

        return updatedLogs;
      });

      // Show cyberpunk theme quote popup toast ONLY if HP reaches 0
      if (newHp === 0) {
        setPopupQuote(randomQuote);
      }

      return newHp;
    });

    // Flash Smasher visual mesh
    setDamageFlash(true);
    setTimeout(() => setDamageFlash(false), 600);

    if (hackId === 'matrix_override') {
      onOverrideSuccess(); // switch theme to Matrix
      // Show success feedback
      setActiveEffect('success');
      setTimeout(() => setActiveEffect(null), 3000);
    } else if (hackId === 'reboot_optics') {
      setActiveEffect('shock');
      setTimeout(() => setActiveEffect(null), 1800);
    } else if (hackId === 'short_circuit') {
      setActiveEffect('shock');
      setTimeout(() => setActiveEffect(null), 1800);
    } else if (hackId === 'cyberware_malfunction') {
      setActiveEffect('malfunction');
      // Apply body level text scramble class
      document.body.classList.add('cyberdeck-malfunction');
      setTimeout(() => {
        document.body.classList.remove('cyberdeck-malfunction');
        setActiveEffect(null);
      }, 5000);
    } else if (hackId === 'sonic_shock') {
      setActiveEffect('malfunction');
      // Apply body level text scramble class
      document.body.classList.add('cyberdeck-malfunction');
      setTimeout(() => {
        document.body.classList.remove('cyberdeck-malfunction');
        setActiveEffect(null);
      }, 3000);
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
    setRamValue(30); // Instantly set current RAM to new max (30) on upgrade
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

        {/* ── Signal Intercept Cyberpunk Alert Popup ── */}
        <AnimatePresence>
          {popupQuote && (
            <AlertPopup
              initial={{ opacity: 0, scale: 0.9, y: '-60%', x: '-50%' }}
              animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
              exit={{ opacity: 0, scale: 0.9, y: '-40%', x: '-50%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="header">
                <span>
                  <i className="fas fa-satellite-dish icon" style={{ marginRight: '6px' }} />
                  SIGNAL INTERCEPTED
                </span>
                <span style={{ color: '#ff3366', opacity: 0.8 }}>DECRYPTED</span>
              </div>
              <div className="quote-content">
                {popupQuote}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <AlertButton
                  onClick={() => {
                    setPopupQuote(null);
                    setTargetHp(100);
                    setLogs(prev => [
                      ...prev,
                      {
                        id: Math.random().toString(),
                        type: 'system',
                        text: '[SYSTEM] REBOOTING SCAN TARGET... HP RESTORED.'
                      }
                    ]);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Uhh....Okayy?
                </AlertButton>
              </div>
            </AlertPopup>
          )}
        </AnimatePresence>

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
              CYBERDECK RAM: {ramValue}/{sysCollapseUnlocked ? 30 : 26}
            </RAMTitle>
            <RAMBar>
              {Array.from({ length: sysCollapseUnlocked ? 30 : 26 }).map((_, i) => (
                <RAMSlot 
                  key={i} 
                  $filled={i < ramValue} 
                />
              ))}
            </RAMBar>
          </HeaderCenter>

          <HeaderRight>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <i className="fas fa-bolt" style={{ color: '#00f0ff' }} />
              <span>POWER CONNECTED</span>
            </div>
            <span style={{ opacity: 0.5 }}>CAMERA 04</span>
            <CloseHUDButton 
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Close Netrunner HUD"
            >
              <i className="fas fa-times" />
              <span>DISCONNECT [ESC]</span>
            </CloseHUDButton>
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
              const hasInsufficientRam = ramValue < h.ram;
              const statusText = isLocked 
                ? 'LOCKED' 
                : hasInsufficientRam 
                  ? 'INSUFFICIENT RAM' 
                  : 'READY';
              
              return (
                <QuickhackButton
                  key={h.id}
                  $active={currentActive}
                  $locked={isLocked || hasInsufficientRam}
                  onClick={() => selectHack(i)}
                  whileHover={!(isLocked || hasInsufficientRam) ? { scale: 1.02, x: 4 } : {}}
                  whileTap={!(isLocked || hasInsufficientRam) ? { scale: 0.98 } : {}}
                >
                  <div className="name-block">
                    <span className="title">{h.title}</span>
                    <span className="status-tag">{statusText}</span>
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
              <span>ADAM SMASHER // FINAL BOSS</span>
            </TargetHeader>
            <TargetOutline>
              <ReticleRing />
              <ModelViewer
                modelUrl={adamModelUrl}
                renderMode="original"
                color={0xff3366}
                opacity={0.85}
                interactive={false}
                autoRotate={true}
                rotateSpeed={0.012}
                floatAnimation={true}
                cameraY={0.5}
                onAnimate={handleHUDAnimate}
              />
              <TargetVector viewBox="0 0 360 380">
                {/* Horizontal scanner trace bar */}
                <line className="scanning-line" x1="20" y1="190" x2="340" y2="190" />
                {/* Reticle corner ticks */}
                <path d="M 10 10 L 30 10 M 10 10 L 10 30" strokeWidth="2.5" />
                <path d="M 350 10 L 330 10 M 350 10 L 350 30" strokeWidth="2.5" />
                <path d="M 10 370 L 30 370 M 10 370 L 10 350" strokeWidth="2.5" />
                <path d="M 350 370 L 330 370 M 350 370 L 350 350" strokeWidth="2.5" />
              </TargetVector>
            </TargetOutline>
            
            {/* Telemetry metadata overlay */}
            <div style={{ position: 'absolute', bottom: 'calc(4% + 96px)', fontSize: '0.62rem', color: '#ff3366', opacity: 0.75, display: 'flex', flexDirection: 'column', gap: '5px', border: '1px solid rgba(255,51,102,0.15)', padding: '8px 14px', background: 'rgba(0,0,0,0.6)', borderRadius: '4px', minWidth: '130px', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>HP:</span>
                <span style={{ 
                  fontWeight: 'bold', 
                  color: targetHp > 50 ? '#00ff41' : targetHp > 20 ? '#eab308' : '#ff3366',
                  textShadow: `0 0 5px ${targetHp > 50 ? '#00ff4180' : targetHp > 20 ? '#eab30880' : '#ff336680'}`
                }}>
                  {targetHp > 0 ? `${targetHp}/100` : 'OFFLINE'}
                </span>
              </div>
              
              {/* HP Bar */}
              <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${targetHp}%`, 
                  background: targetHp > 50 ? '#00ff41' : targetHp > 20 ? '#eab308' : '#ff3366',
                  boxShadow: `0 0 4px ${targetHp > 50 ? '#00ff41' : targetHp > 20 ? '#eab308' : '#ff3366'}`,
                  transition: 'width 0.35s cubic-bezier(0.1, 0.8, 0.3, 1)' 
                }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                <span>LOC:</span>
                <span style={{ color: '#ffffff' }}>BENGALURU, IN</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>LEVEL:</span>
                <span style={{ color: '#ffffff' }}>42</span>
              </div>
            </div>

            {/* Terminal Logs Panel */}
            <TerminalLogBox>
              {logs.map((log) => (
                <LogLine key={log.id} $type={log.type}>
                  {log.text}
                </LogLine>
              ))}
              <div ref={logEndRef} />
            </TerminalLogBox>

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
                <span>Base Damage</span>
                <span style={{ color: '#00f0ff', fontWeight: 'bold' }}>-{activeHack.damage} HP</span>
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
                disabled={activeHack.locked || isUploading || ramValue < activeHack.ram}
                whileHover={!(activeHack.locked || isUploading || ramValue < activeHack.ram) ? { scale: 1.03 } : {}}
                whileTap={!(activeHack.locked || isUploading || ramValue < activeHack.ram) ? { scale: 0.97 } : {}}
                style={{ opacity: (activeHack.locked || isUploading || ramValue < activeHack.ram) ? 0.45 : 1 }}
              >
                <i className="fas fa-terminal" />
                <span>
                  {ramValue < activeHack.ram && !activeHack.locked ? 'INSUFFICIENT RAM' : '[F] Execute Hack'}
                </span>
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

  if (isLowResolution && !forceConnect) {
    const warningContent = (
      <ResolutionWarningScreen>
        <div className="warning-icon">
          <i className="fas fa-exclamation-triangle" />
        </div>
        <div className="title">Warning: Link Degraded</div>
        <div className="message">
          Netrunner HUD's cyberdeck overlay requires a minimum resolution of 1200 x 700 to display all tactical data streams correctly.
          Current viewport scaling may cause display malfunctions or text collisions.
        </div>
        <div className="dimensions-box">
          CURRENT TERMINAL: {dimensions.width} x {dimensions.height} // REQ: 1200 x 700
        </div>
        <div className="button-group">
          <AlertButton 
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Abort Connection
          </AlertButton>
          <AlertButton 
            onClick={() => setForceConnect(true)}
            style={{ borderColor: '#00f0ff', color: '#00f0ff', boxShadow: '0 0 10px rgba(0, 240, 255, 0.15)' }}
            whileHover={{ background: 'rgba(0, 240, 255, 0.12)', boxShadow: '0 0 20px rgba(0, 240, 255, 0.45)', scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Force Connect
          </AlertButton>
        </div>
      </ResolutionWarningScreen>
    );

    return typeof document !== 'undefined' ? createPortal(warningContent, document.body) : warningContent;
  }

  return typeof document !== 'undefined' ? createPortal(hudContent, document.body) : hudContent;
}
