import { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css, useTheme as useStyledTheme } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import skillsData from '../../data/skills.json';

/* ── Typography & Global Styling Tokens ───────────────────── */

const SCANLINE_ANIM = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

const PULSE_GLOW = keyframes`
  0%, 100% {
    opacity: 0.3;
    filter: drop-shadow(0 0 2px var(--glow-color));
  }
  50% {
    opacity: 1;
    filter: drop-shadow(0 0 8px var(--glow-color));
  }
`;

const BLINK = keyframes`
  50% { opacity: 0; }
`;

/* ── Container ────────────────────────────────────────────── */

const AboutContainer = styled.section`
  min-height: 100vh;
  width: 100%;
  position: relative;
  z-index: 1;
  padding: 120px 20px 80px;
  margin: 0 auto;
  max-width: 1280px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 1024px) {
    padding: 100px 20px 60px;
  }

  @media (max-width: 768px) {
    padding: 80px 15px 50px;
  }

  @media (max-width: 480px) {
    padding: 70px 12px 40px;
  }
`;

/* ── Header ───────────────────────────────────────────────── */

const Header = styled.div`
  text-align: center;
  margin-bottom: 48px;

  @media (max-width: 768px) {
    margin-bottom: 36px;
  }
`;

const Title = styled(motion.h2)`
  font-size: 3.2rem;
  font-weight: 800;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #00ff88);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
  font-family: 'Orbitron', 'Audiowide', sans-serif;
  letter-spacing: 0.05em;
  text-transform: uppercase;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-family: 'Fira Code', monospace;
  opacity: 0.8;
  max-width: 650px;
  margin: 0 auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

/* ── Workstation Grid Layout ─────────────────────────────── */

const WorkstationGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.35fr;
  gap: 30px;
  width: 100%;
  position: relative;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

/* ── Panel Components ────────────────────────────────────── */

const PanelWindow = styled(motion.div)`
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(20px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${({ theme }) => theme.colors.primary}60, transparent);
    z-index: 3;
  }
`;

const PanelHeader = styled.div`
  height: 38px;
  background: rgba(0, 0, 0, 0.45);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  font-family: 'Fira Code', monospace;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.primary}c0;
  user-select: none;
  flex-shrink: 0;
`;

const WindowControls = styled.div`
  display: flex;
  gap: 6px;
`;

const WindowDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.color};
  opacity: 0.7;
`;

const PanelContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Scanline = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(to bottom, transparent, ${({ theme }) => theme.colors.primary}10, transparent);
  animation: ${SCANLINE_ANIM} 10s linear infinite;
  pointer-events: none;
  z-index: 4;
`;

const GridOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(${({ theme }) => theme.colors.primary}03 1px, transparent 1px),
                    linear-gradient(90deg, ${({ theme }) => theme.colors.primary}03 1px, transparent 1px);
  background-size: 20px 20px;
  pointer-events: none;
  opacity: 0.5;
  z-index: 0;
`;

/* ── Left Panel (System Diagnostics Terminal) ────────────── */

const SystemInfoSection = styled.div`
  display: flex;
  gap: 20px;
  padding: 24px;
  background: rgba(0, 0, 0, 0.15);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  z-index: 1;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    gap: 16px;
    text-align: center;
  }
`;

const MascotContainer = styled.div`
  width: 100px;
  height: 100px;
  color: ${({ theme }) => theme.colors.primary};
  --glow-color: ${({ theme }) => theme.colors.primary};
  animation: ${PULSE_GLOW} 3s ease-in-out infinite;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
  }
`;

const NeofetchList = styled.div`
  font-family: 'Fira Code', monospace;
  font-size: 0.82rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
`;

const NeoLine = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  strong {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
  }
`;

const TerminalConsole = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  z-index: 1;
  background: rgba(0, 0, 0, 0.25);
`;

const LogsDisplay = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  font-family: 'Fira Code', monospace;
  font-size: 0.78rem;
  line-height: 1.55;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 160px;
  max-height: 220px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 2px;
  }
`;

const LogLine = styled.div`
  white-space: pre-wrap;
  word-break: break-all;
`;

const CommandBar = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const CommandBtn = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-family: 'Fira Code', monospace;
  font-size: 0.7rem;
  padding: 4px 8px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primary}12;
    transform: translateY(-1px);
  }
`;

const ConsoleInputForm = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.4);
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-family: 'Fira Code', monospace;
  font-size: 0.8rem;
`;

const PromptPrefix = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  user-select: none;
`;

const ConsoleInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: ${({ theme }) => theme.colors.text};
  font-family: 'Fira Code', monospace;
  font-size: 0.8rem;
  caret-color: ${({ theme }) => theme.colors.primary};
`;

const CursorBlinker = styled.span`
  animation: ${BLINK} 1s step-end infinite;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
`;

/* ── Right Panel (IDE Workspace) ─────────────────────────── */

const WorkspaceLayout = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  min-height: 480px;

  @media (max-width: 768px) {
    min-height: 400px;
  }
`;

const FileTree = styled.div`
  width: 180px;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(0, 0, 0, 0.18);
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-family: 'Fira Code', monospace;
  font-size: 0.78rem;
  user-select: none;
  flex-shrink: 0;

  @media (max-width: 600px) {
    display: none; /* Collapsed on mobile, rely on tabs */
  }
`;

const TreeTitle = styled.div`
  font-size: 0.7rem;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const TreeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  border-radius: 4px;
  cursor: pointer;
  color: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.textSecondary)};
  background: ${({ $active }) => ($active ? 'rgba(100, 255, 218, 0.08)' : 'transparent')};
  transition: all 0.25s ease;
  padding-left: ${props => (props.$depth * 10 + 8)}px;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: rgba(100, 255, 218, 0.04);
  }
`;

const EditorView = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TabsRow = styled.div`
  display: flex;
  background: rgba(0, 0, 0, 0.35);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  overflow-x: auto;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const EditorTab = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  font-family: 'Fira Code', monospace;
  font-size: 0.78rem;
  cursor: pointer;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  background: ${props => (props.$active ? 'rgba(0, 0, 0, 0.15)' : 'transparent')};
  color: ${props => (props.$active ? '#ffffff' : props.theme.colors.textSecondary)};
  border-bottom: 2px solid ${props => (props.$active ? props.theme.colors.primary : 'transparent')};
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.02);
    color: #ffffff;
  }
`;

const EditorBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 16px;
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.text};
  position: relative;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 3px;
  }

  @media (max-width: 480px) {
    font-size: 0.78rem;
    padding: 16px 12px;
  }
`;

const CodeLine = styled.div`
  display: flex;
  margin-bottom: 4px;
`;

const LineNumber = styled.span`
  width: 28px;
  color: ${({ theme }) => theme.colors.textSecondary};
  opacity: 0.3;
  text-align: right;
  margin-right: 16px;
  user-select: none;
  font-size: 0.75rem;
`;

const LineCode = styled.span`
  flex: 1;
  white-space: pre-wrap;
  word-break: break-all;
`;

const HighlightWord = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
`;

const InteractiveTag = styled(motion.span)`
  background: ${props => props.$color}15;
  color: ${props => props.$color};
  border: 1px solid ${props => props.$color}35;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.84rem;
  font-family: 'Fira Code', monospace;
  font-weight: 600;
  cursor: pointer;
  display: inline-block;
  transition: all 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  &:hover {
    background: ${props => props.$color}25;
    border-color: ${props => props.$color};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.$color}40;
  }

  @media (max-width: 480px) {
    font-size: 0.76rem;
    padding: 3px 8px;
  }
`;

const SkillCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.025) 0%, rgba(255, 255, 255, 0.005) 100%);
  backdrop-filter: blur(12px);
  border: 1px solid ${props => props.$color}25;
  border-radius: 8px;
  padding: 14px 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 80px;
  position: relative;
  overflow: hidden;
  user-select: none;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  /* Diagonal micro-stripes */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 8px,
      ${props => props.$color}02 8px,
      ${props => props.$color}02 9px
    );
    opacity: 0.7;
    z-index: 0;
    transition: opacity 0.3s ease;
  }

  /* HUD Top-Right Bracket */
  &::after {
    content: '';
    position: absolute;
    top: 5px;
    right: 5px;
    width: 6px;
    height: 6px;
    border-top: 1.5px solid ${props => props.$color};
    border-right: 1.5px solid ${props => props.$color};
    opacity: 0.35;
    transition: all 0.3s ease;
    z-index: 1;
  }

  /* HUD Bottom-Left Bracket */
  .hud-bracket-bl {
    position: absolute;
    bottom: 5px;
    left: 5px;
    width: 6px;
    height: 6px;
    border-bottom: 1.5px solid ${props => props.$color};
    border-left: 1.5px solid ${props => props.$color};
    opacity: 0.35;
    transition: all 0.3s ease;
    z-index: 1;
  }

  &:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.015) 100%);
    border-color: ${props => props.$color};
    transform: translateY(-3px) scale(1.02);
    box-shadow: 
      0 6px 20px ${props => props.$color}20,
      inset 0 0 8px ${props => props.$color}15;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover::after,
  &:hover .hud-bracket-bl {
    opacity: 1;
    transform: scale(1.15);
  }
`;

const SkillName = styled.span`
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: 0.03em;
  color: #ffffff;
  z-index: 2;
  text-transform: uppercase;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StatusBadge = styled.span`
  font-family: 'Fira Code', monospace;
  font-size: 0.6rem;
  color: ${props => props.$color};
  font-weight: 600;
  padding: 2px 7px;
  background: ${props => props.$color}18;
  border: 1px solid ${props => props.$color}30;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  z-index: 2;
  align-self: flex-start;

  &::before {
    content: '';
    width: 3.5px;
    height: 3.5px;
    border-radius: 50%;
    background: ${props => props.$color};
    display: inline-block;
    box-shadow: 0 0 4px ${props => props.$color};
  }
`;

const SkillNavBtn = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${props => props.$color || props.theme.colors.textSecondary};
  padding: 4px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Fira Code', monospace;
  font-size: 0.76rem;
  font-weight: 600;
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    border-color: ${props => props.$color || props.theme.colors.primary};
    background: ${props => (props.$color || props.theme.colors.primary)}12;
    color: ${props => props.$color || props.theme.colors.primary};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px ${props => props.$color}20;
  }

  &:active {
    transform: translateY(0);
  }
`;

const EditorStatusBar = styled.div`
  height: 26px;
  background: rgba(0, 0, 0, 0.4);
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  font-family: 'Fira Code', monospace;
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  opacity: 0.75;
  user-select: none;
  flex-shrink: 0;
`;

/* ── SVG Icons ───────────────────────────────────────────── */

const CPU_SVG = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="25" y="25" width="50" height="50" rx="8" stroke="currentColor" strokeWidth="2" fill="rgba(100, 255, 218, 0.02)" />
    <rect x="34" y="34" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
    <text x="50" y="55" fill="currentColor" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">&gt;_</text>
    <path d="M 50 12 L 50 25" stroke="currentColor" strokeWidth="1.5" />
    <path d="M 50 75 L 50 88" stroke="currentColor" strokeWidth="1.5" />
    <path d="M 12 50 L 25 50" stroke="currentColor" strokeWidth="1.5" />
    <path d="M 75 50 L 88 50" stroke="currentColor" strokeWidth="1.5" />
    <path d="M 38 15 L 38 25" stroke="currentColor" strokeWidth="1" />
    <path d="M 62 15 L 62 25" stroke="currentColor" strokeWidth="1" />
    <path d="M 38 75 L 38 85" stroke="currentColor" strokeWidth="1" />
    <path d="M 62 75 L 62 85" stroke="currentColor" strokeWidth="1" />
    <path d="M 15 38 L 25 38" stroke="currentColor" strokeWidth="1" />
    <path d="M 15 62 L 25 62" stroke="currentColor" strokeWidth="1" />
    <path d="M 75 38 L 85 38" stroke="currentColor" strokeWidth="1" />
    <path d="M 75 62 L 85 62" stroke="currentColor" strokeWidth="1" />
    <circle cx="50" cy="12" r="2" fill="currentColor" />
    <circle cx="50" cy="88" r="2" fill="currentColor" />
    <circle cx="12" cy="50" r="2" fill="currentColor" />
    <circle cx="88" cy="50" r="2" fill="currentColor" />
  </svg>
);

const FolderIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style={{ opacity: 0.8, color: '#ffca28' }}>
    <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H8l-2-2H2z" />
  </svg>
);

const FileIcon = ({ type }) => {
  let color = '#a0aab0';
  if (type === 'md') color = '#64b5f6';
  if (type === 'json') color = '#ffb74d';
  if (type === 'log') color = '#81c784';

  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill={color}>
      <path d="M4 1h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2zm0 1v12h8V3H9V2H4zm6 0v1h1.5L10 2z" />
    </svg>
  );
};

/* ── Content Databases ───────────────────────────────────── */

const bootLogs = [
  '[  0.000000] Linux version 6.9.3-arch-lambda (gcc version 14.1.1)',
  '[  0.038102] CPU0: Intel(R) Core(TM) i9 CPU @ 3.40GHz',
  '[  0.109241] BIOS-provided physical RAM map initialized',
  '[  0.410294] ACPI: Core revision 20260101',
  '[  1.024921] usbcore: registered new interface driver hub',
  '[  1.789124] ext4-fs (nvme0n1p2): mounted filesystem [OK]',
  '[  2.340918] systemd[1]: Started System Logging Daemon',
  '[  3.042109] systemd[1]: Reached target Multi-User System',
  '[  3.510982] shura-daemon: INITIALIZED NOMINAL [ONLINE]'
];

/* ── Component ────────────────────────────────────────────── */

export default function About() {
  const [activeTab, setActiveTab] = useState('skills.json');
  const [selectedSkillCat, setSelectedSkillCat] = useState(0);
  const [skillsViewMode, setSkillsViewMode] = useState('visual');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const categories = Object.keys(skillsData || {});
  const currentCategory = categories[selectedSkillCat] || categories[0] || '';
  const currentCategoryData = skillsData?.[currentCategory] || { description: '', color: '', skills: [] };
  const currentSkills = currentCategoryData.skills || [];

  const styledTheme = useStyledTheme();
  const isLight = styledTheme?.name === 'Light Mode';

  const getCategoryColor = (categoryKey) => {
    const rawColor = skillsData[categoryKey]?.color || styledTheme?.colors?.primary || '#64ffda';
    if (isLight) {
      switch (categoryKey) {
        case 'Cloud Infrastructure': return '#0284c7';
        case 'Backend Engineering': return '#ea580c';
        case 'Frontend Development': return '#0d9488';
        case 'Systems & DevOps': return '#7c3aed';
        case 'Android & AOSP ROMs': return '#65a30d';
        default: {
          const hex = rawColor.replace('#', '');
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          const scale = 0.7;
          const dr = Math.floor(r * scale);
          const dg = Math.floor(g * scale);
          const db = Math.floor(b * scale);
          const toHex = (c) => {
            const h = c.toString(16);
            return h.length === 1 ? '0' + h : h;
          };
          return `#${toHex(dr)}${toHex(dg)}${toHex(db)}`;
        }
      }
    }
    return rawColor;
  };

  const renderSkillsJson = () => {
    const catColor = getCategoryColor(currentCategory);
    let lineIdx = 1;

    const renderControls = () => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px dashed rgba(255, 255, 255, 0.08)', userSelect: 'none', gap: '8px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <SkillNavBtn
            type="button"
            onClick={() => setSelectedSkillCat(prev => (prev > 0 ? prev - 1 : categories.length - 1))}
            $color={catColor}
          >
            ← PREV
          </SkillNavBtn>
          <SkillNavBtn
            type="button"
            onClick={() => setSelectedSkillCat(prev => (prev < categories.length - 1 ? prev + 1 : 0))}
            $color={catColor}
          >
            NEXT →
          </SkillNavBtn>
        </div>
        
        <span style={{ fontFamily: 'Fira Code', fontSize: '0.8rem', color: '#ffffff', opacity: 0.85, textAlign: 'center' }}>
          {currentCategory} ({selectedSkillCat + 1}/{categories.length})
        </span>

        <SkillNavBtn
          type="button"
          onClick={() => setSkillsViewMode(prev => (prev === 'visual' ? 'json' : 'visual'))}
          $color={catColor}
          style={{ fontSize: '0.7rem', borderStyle: 'dashed' }}
        >
          {skillsViewMode === 'visual' ? '{ } VIEW RAW JSON' : '👁️ VIEW PREVIEW'}
        </SkillNavBtn>
      </div>
    );

    if (skillsViewMode === 'visual') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {renderControls()}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              <p style={{ fontSize: '0.86rem', color: 'rgba(230, 230, 230, 0.7)', fontFamily: 'Rajdhani', fontStyle: 'italic', margin: '0 0 4px 0', lineHeight: 1.4 }}>
                {currentCategoryData.description}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                {currentSkills.map((skill) => {
                  const skillName = skill.name;
                  const subTag = skill.info || 'Active';
                  return (
                    <SkillCard key={skillName} $color={catColor}>
                      <div className="hud-bracket-bl" />
                      <SkillName title={skillName}>{skillName}</SkillName>
                      <StatusBadge $color={catColor}>{subTag}</StatusBadge>
                    </SkillCard>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {renderControls()}

        {/* JSON Editor Representation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCategory}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.15 }}
          >
            <CodeLine>
              <LineNumber>{lineIdx++}</LineNumber>
              <LineCode style={{ color: '#ffffff', opacity: 0.6 }}>{'{'}</LineCode>
            </CodeLine>
            
            <CodeLine>
              <LineNumber>{lineIdx++}</LineNumber>
              <LineCode>
                <span style={{ color: catColor, fontWeight: '600' }}>  "{currentCategory}"</span>
                <span style={{ color: '#ffffff', opacity: 0.6 }}>: {'{'}</span>
              </LineCode>
            </CodeLine>

            <CodeLine>
              <LineNumber>{lineIdx++}</LineNumber>
              <LineCode>
                <span style={{ color: '#a5d6ff' }}>    "description"</span>
                <span style={{ color: '#ffffff', opacity: 0.6 }}>: </span>
                <span style={{ color: '#ffab70' }}>"{currentCategoryData.description}"</span>
                <span style={{ color: '#ffffff', opacity: 0.6 }}>,</span>
              </LineCode>
            </CodeLine>

            <CodeLine>
              <LineNumber>{lineIdx++}</LineNumber>
              <LineCode>
                <span style={{ color: '#a5d6ff' }}>    "color"</span>
                <span style={{ color: '#ffffff', opacity: 0.6 }}>: </span>
                <span style={{ color: '#ffab70' }}>"{currentCategoryData.color}"</span>
                <span style={{ color: '#ffffff', opacity: 0.6 }}>,</span>
              </LineCode>
            </CodeLine>

            <CodeLine>
              <LineNumber>{lineIdx++}</LineNumber>
              <LineCode>
                <span style={{ color: '#a5d6ff' }}>    "skills"</span>
                <span style={{ color: '#ffffff', opacity: 0.6 }}>: [</span>
              </LineCode>
            </CodeLine>

            {currentSkills.map((skill, sIdx) => {
              const isLast = sIdx === currentSkills.length - 1;
              return (
                <CodeLine key={skill.name}>
                  <LineNumber>{lineIdx++}</LineNumber>
                  <LineCode style={{ paddingLeft: '48px' }}>
                    <span style={{ color: '#ffffff', opacity: 0.6 }}>{'{'} </span>
                    <span style={{ color: '#79c0ff' }}>"name"</span>
                    <span style={{ color: '#ffffff', opacity: 0.6 }}>: </span>
                    <InteractiveTag 
                      $color={catColor} 
                      whileHover={{ scale: 1.03 }}
                      style={{ padding: '2px 6px', fontSize: '0.75rem', margin: '0 4px' }}
                    >
                      "{skill.name}"
                    </InteractiveTag>
                    <span style={{ color: '#ffffff', opacity: 0.6 }}>, </span>
                    <span style={{ color: '#79c0ff' }}>"info"</span>
                    <span style={{ color: '#ffffff', opacity: 0.6 }}>: </span>
                    <span style={{ color: '#ffab70' }}>"{skill.info}"</span>
                    <span style={{ color: '#ffffff', opacity: 0.6 }}> {'}'}</span>
                    {!isLast && <span style={{ color: '#ffffff', opacity: 0.4 }}>,</span>}
                  </LineCode>
                </CodeLine>
              );
            })}

            <CodeLine>
              <LineNumber>{lineIdx++}</LineNumber>
              <LineCode style={{ color: '#ffffff', opacity: 0.6 }}>    ]</LineCode>
            </CodeLine>
            
            <CodeLine>
              <LineNumber>{lineIdx++}</LineNumber>
              <LineCode style={{ color: '#ffffff', opacity: 0.6 }}>  {'}'}</LineCode>
            </CodeLine>
            
            <CodeLine>
              <LineNumber>{lineIdx}</LineNumber>
              <LineCode style={{ color: '#ffffff', opacity: 0.6 }}>{'}'}</LineCode>
            </CodeLine>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  const renderStatsLog = (line, idx) => {
    const match = line.match(/^(\[.*?\])\s+(\[.*?\])\s+(.*)$/);
    if (match) {
      const timestamp = match[1];
      const statusTag = match[2];
      const message = match[3];

      let tagColor = '#64ffda';
      if (statusTag.includes('INIT')) tagColor = '#3b82f6';
      if (statusTag.includes('OK')) tagColor = '#10b981';
      if (statusTag.includes('INFO')) tagColor = '#f59e0b';
      if (statusTag.includes('STATUS')) tagColor = '#ec4899';

      return (
        <CodeLine key={idx}>
          <LineNumber>{idx + 1}</LineNumber>
          <LineCode>
            <span style={{ color: 'rgba(255, 255, 255, 0.25)' }}>{timestamp} </span>
            <span style={{ color: tagColor, fontWeight: '700' }}>{statusTag} </span>
            <span style={{ color: 'rgba(230, 230, 230, 0.85)' }}>{message}</span>
          </LineCode>
        </CodeLine>
      );
    }

    return (
      <CodeLine key={idx}>
        <LineNumber>{idx + 1}</LineNumber>
        <LineCode style={{ color: 'rgba(230, 230, 230, 0.5)' }}>{line}</LineCode>
      </CodeLine>
    );
  };

  const logContent = [
    '[2017-06-06] [INIT] Started computer programming & shell scripting',
    '[2019-10-15] [OK] Configured desktop environment on standalone Arch Linux',
    '[2021-02-12] [OK] Compiled custom Android ROM from source for public release',
    '[2023-08-30] [INFO] Scaled ROM releases (reached 25k+ public installations)',
    '[2025-04-18] [OK] Architected modular microservice clusters in Go on AWS Lambda',
    '[2026-06-06] [STATUS] Operating system state: ONLINE & CODING'
  ];

  return (
    <AboutContainer id="about">
      {/* ── Header ── */}
      <Header>
        <Title
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {`<About_System />`}
        </Title>
        <Subtitle
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          viewport={{ once: true }}
        >
          shura@portfolio:~$ diagnostics_check --target backend_infra --device Android_ROM
        </Subtitle>
      </Header>

      {/* ── Dashboard Grid ── */}
      <WorkstationGrid>
        
        {/* Left Panel: System Diagnostics Console */}
        <PanelWindow
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Scanline />
          <GridOverlay />
          
          <PanelHeader>
            <WindowControls>
              <WindowDot color="#ff5f56" />
              <WindowDot color="#ffbd2e" />
              <WindowDot color="#27c93f" />
            </WindowControls>
            <div>shura@diagnostics:~/neofetch</div>
            <div style={{ opacity: 0.5 }}>bash</div>
          </PanelHeader>

          <PanelContent>
            {/* Neofetch Section */}
            <SystemInfoSection>
              <MascotContainer>
                <CPU_SVG />
              </MascotContainer>
              <NeofetchList>
                <NeoLine><strong>USER</strong>: shura</NeoLine>
                <NeoLine><strong>OS</strong>: Arch Linux x86_64</NeoLine>
                <NeoLine><strong>KERNEL</strong>: 6.9.3-arch-lambda</NeoLine>
                <NeoLine><strong>ENV</strong>: AWS Lambda / Go / AOSP</NeoLine>
                <NeoLine><strong>UPTIME</strong>: 9 years active</NeoLine>
                <NeoLine><strong>ROM_RELEASES</strong>: 100+ public dists</NeoLine>
                <NeoLine><strong>STATUS</strong>: online_and_coding</NeoLine>
              </NeofetchList>
            </SystemInfoSection>

            {/* Terminal Logger */}
            <TerminalConsole style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <LogsDisplay style={{ flex: 1, minHeight: '180px' }}>
                {bootLogs.map((log, index) => {
                  const match = log.match(/^(\[.*?\])\s+(.*)$/);
                  if (match) {
                    return (
                      <LogLine key={index}>
                        <span style={{ color: 'rgba(100, 255, 218, 0.35)', marginRight: '8px', userSelect: 'none' }}>{match[1]}</span>
                        <span style={{ color: 'rgba(230, 230, 230, 0.8)' }}>{match[2]}</span>
                      </LogLine>
                    );
                  }
                  return <LogLine key={index} style={{ color: 'rgba(230, 230, 230, 0.8)' }}>{log}</LogLine>;
                })}
              </LogsDisplay>
            </TerminalConsole>
          </PanelContent>
        </PanelWindow>

        {/* Right Panel: Code Workspace IDE */}
        <PanelWindow
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Scanline />
          <GridOverlay />

          <PanelHeader>
            <WindowControls>
              <WindowDot color="#ff5f56" />
              <WindowDot color="#ffbd2e" />
              <WindowDot color="#27c93f" />
            </WindowControls>
            <div>nvim ~/workspace/portfolio</div>
            <div style={{ opacity: 0.5 }}>UTF-8</div>
          </PanelHeader>

          <PanelContent>
            <WorkspaceLayout>
              
              {/* Sidebar Explorer */}
              <FileTree>
                <TreeTitle>
                  <FolderIcon /> WORKSPACE
                </TreeTitle>
                
                <TreeItem $active={false} $depth={0} style={{ pointerEvents: 'none' }}>
                  <FolderIcon /> portfolio
                </TreeItem>
                <TreeItem $active={false} $depth={1} style={{ pointerEvents: 'none' }}>
                  <FolderIcon /> info
                </TreeItem>
                <TreeItem 
                  $active={activeTab === 'stats.log'} 
                  $depth={2} 
                  onClick={() => setActiveTab('stats.log')}
                >
                  <FileIcon type="log" /> stats.log
                </TreeItem>
                
                <TreeItem $active={false} $depth={1} style={{ pointerEvents: 'none' }}>
                  <FolderIcon /> config
                </TreeItem>
                <TreeItem 
                  $active={activeTab === 'skills.json'} 
                  $depth={2} 
                  onClick={() => setActiveTab('skills.json')}
                >
                  <FileIcon type="json" /> skills.json
                </TreeItem>
              </FileTree>

              {/* Editor View */}
              <EditorView>
                
                {/* Tabs */}
                <TabsRow>
                  <EditorTab $active={activeTab === 'skills.json'} onClick={() => setActiveTab('skills.json')}>
                    <FileIcon type="json" /> skills.json
                  </EditorTab>
                  <EditorTab $active={activeTab === 'stats.log'} onClick={() => setActiveTab('stats.log')}>
                    <FileIcon type="log" /> stats.log
                  </EditorTab>
                </TabsRow>

                {/* Editor Content Area */}
                <EditorBody>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      style={{ height: '100%' }}
                    >
                      {activeTab === 'skills.json' && renderSkillsJson()}
                      {activeTab === 'stats.log' && logContent.map((line, idx) => renderStatsLog(line, idx))}
                    </motion.div>
                  </AnimatePresence>
                </EditorBody>

                {/* Status Bar */}
                <EditorStatusBar>
                  <div>
                    Normal | {activeTab === 'skills.json' ? 'JSON' : 'Log'}
                  </div>
                  <div>
                    Ln {activeTab === 'skills.json' 
                      ? (skillsViewMode === 'visual' ? 15 : 8 + currentSkills.length) 
                      : logContent.length}, Col 1 | UTF-8 | Git:master*
                  </div>
                </EditorStatusBar>

              </EditorView>

            </WorkspaceLayout>
          </PanelContent>
        </PanelWindow>

      </WorkstationGrid>
    </AboutContainer>
  );
}
