'use client';

import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import styled, { keyframes, css } from 'styled-components';
import Badges from '../Badges';
import { useRef, useState, useEffect } from 'react';

/* ── Animated Counter Hook ────────────────────────────────── */

function useCountUp(target, duration = 2200, startCounting = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;
    const end = parseInt(target, 10);
    if (isNaN(end)) return;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -12 * progress);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, startCounting]);

  return count;
}

/* ── Keyframes ────────────────────────────────────────────── */

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const gridPulse = keyframes`
  0%, 100% { opacity: 0.03; }
  50% { opacity: 0.08; }
`;

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
`;

const orbitSpin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const borderGlow = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
`;

const dotBlink = keyframes`
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
`;

/* ── Container ────────────────────────────────────────────── */

const AchievementsContainer = styled.section`
  min-height: 100vh;
  width: 100%;
  position: relative;
  z-index: 1;
  padding: 120px 20px 80px;
  margin: 0 auto;
  max-width: 1200px;
  align-items: stretch;
  overflow-x: hidden;

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
  margin-bottom: 56px;
  position: relative;

  @media (max-width: 768px) {
    margin-bottom: 40px;
  }
`;

const Title = styled(motion.h2)`
  font-size: 4rem;
  font-weight: 900;
  font-family: 'Orbitron', 'Audiowide', sans-serif;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 16px;
  position: relative;
  display: inline-block;

  /* Gradient fill */
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary} 0%,
    #00ff88 40%,
    ${({ theme }) => theme.colors.primary} 80%
  );
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 6s ease-in-out infinite;

  @media (max-width: 768px) {
    font-size: 2.6rem;
    letter-spacing: 0.04em;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const SubtitleLine = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 8px;

  @media (max-width: 480px) {
    gap: 10px;
    flex-wrap: wrap;
  }
`;

const SubtitleTag = styled.span`
  font-size: 0.82rem;
  font-family: 'Fira Code', monospace;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(8px);

  @media (max-width: 480px) {
    font-size: 0.72rem;
    padding: 4px 10px;
  }
`;

/* ── Main Glass Card ──────────────────────────────────────── */

const MainCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(24px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  overflow: hidden;
  position: relative;

  /* Scanline effect overlay */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      ${({ theme }) => theme.colors.primary}60 20%,
      ${({ theme }) => theme.colors.primary} 50%,
      ${({ theme }) => theme.colors.primary}60 80%,
      transparent 100%
    );
    z-index: 2;
    animation: ${borderGlow} 3s ease-in-out infinite;
  }

  /* Faint grid pattern */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(${({ theme }) => theme.colors.primary}08 1px, transparent 1px),
      linear-gradient(90deg, ${({ theme }) => theme.colors.primary}08 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    animation: ${gridPulse} 4s ease-in-out infinite;
    z-index: 0;
  }
`;

const CardInner = styled.div`
  position: relative;
  z-index: 1;
`;

/* ── Stats Bento Grid ─────────────────────────────────────── */

const StatsSection = styled.div`
  padding: 44px 48px 40px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 768px) {
    padding: 32px 24px 28px;
  }

  @media (max-width: 480px) {
    padding: 24px 16px 22px;
  }
`;

const SectionLabel = styled.h3`
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.primary};
  font-family: 'Fira Code', monospace;
  font-weight: 600;
  margin-bottom: 28px;
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    animation: ${dotBlink} 2s ease-in-out infinite;
    flex-shrink: 0;
  }

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.border},
      transparent
    );
    margin-left: 8px;
  }

  @media (max-width: 480px) {
    font-size: 0.72rem;
    margin-bottom: 22px;
  }
`;

const BentoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const StatCard = styled(motion.div)`
  position: relative;
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 32px 24px 28px;
  text-align: center;
  overflow: hidden;
  cursor: default;
  transition: border-color 0.4s ease, box-shadow 0.4s ease;

  /* Vertical accent line */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 32px;
    height: 2px;
    background: ${({ theme }) => theme.colors.primary};
    opacity: 0.5;
    border-radius: 0 0 2px 2px;
    transition: width 0.3s ease, opacity 0.3s ease;
  }

  /* Radial glow */
  &::after {
    content: '';
    position: absolute;
    top: 40%;
    left: 50%;
    width: 100px;
    height: 100px;
    transform: translate(-50%, -50%);
    background: radial-gradient(
      circle,
      ${({ theme }) => theme.colors.primary}10 0%,
      transparent 70%
    );
    pointer-events: none;
    transition: all 0.4s ease;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary}40;
    box-shadow: 0 0 40px ${({ theme }) => theme.colors.primary}08;

    &::before {
      width: 80%;
      opacity: 0.8;
    }

    &::after {
      width: 200px;
      height: 200px;
      background: radial-gradient(
        circle,
        ${({ theme }) => theme.colors.primary}1a 0%,
        transparent 70%
      );
    }
  }
`;

const StatIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin: 0 auto 18px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.primary}0a;
  border: 1px solid ${({ theme }) => theme.colors.primary}20;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.primary};
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;

  ${StatCard}:hover & {
    background: ${({ theme }) => theme.colors.primary}18;
    border-color: ${({ theme }) => theme.colors.primary}40;
    transform: scale(1.08);
  }
`;

const StatValue = styled.div`
  font-size: 2.8rem;
  font-weight: 800;
  font-family: 'Orbitron', sans-serif;
  color: ${({ theme }) => theme.colors.primary};
  position: relative;
  z-index: 1;
  line-height: 1;
  letter-spacing: 0.02em;

  @media (max-width: 480px) {
    font-size: 2.2rem;
  }
`;

const StatLabel = styled.div`
  font-size: 0.88rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 10px;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  position: relative;
  z-index: 1;
`;

const StatSub = styled.div`
  font-size: 0.74rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 4px;
  opacity: 0.6;
  font-family: 'Fira Code', monospace;
  position: relative;
  z-index: 1;
`;

/* ── GitHub Section ───────────────────────────────────────── */

const GitHubSection = styled.div`
  padding: 40px 48px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 768px) {
    padding: 28px 24px;
  }

  @media (max-width: 480px) {
    padding: 22px 16px;
  }
`;

const GitHubHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
`;

const ProfileViewsPill = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${({ theme }) => theme.colors.border};

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #27c93f;
    animation: ${dotBlink} 2s ease-in-out infinite;
  }

  .label {
    font-size: 0.72rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-family: 'Fira Code', monospace;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  img {
    height: 18px;
  }
`;

const GitHubGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const GitHubCard = styled(motion.div)`
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  background: rgba(255, 255, 255, 0.01);

  /* Corner accents */
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    border: 1px solid ${({ theme }) => theme.colors.primary}30;
    pointer-events: none;
    z-index: 2;
    transition: border-color 0.3s ease;
  }

  &::before {
    top: 6px;
    left: 6px;
    border-right: none;
    border-bottom: none;
  }

  &::after {
    bottom: 6px;
    right: 6px;
    border-left: none;
    border-top: none;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary}35;
    transform: translateY(-4px);
    box-shadow: 0 16px 40px ${({ theme }) => theme.colors.primary}0a;

    &::before,
    &::after {
      border-color: ${({ theme }) => theme.colors.primary}60;
    }
  }

  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

/* ── SourceForge Section ──────────────────────────────────── */

const SourceForgeSection = styled.div`
  padding: 40px 48px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 768px) {
    padding: 28px 24px;
  }

  @media (max-width: 480px) {
    padding: 22px 16px;
  }
`;

const SFLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const DownloadStrip = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 28px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255, 255, 255, 0.015);
  position: relative;
  overflow: hidden;

  /* Animated shimmer bar */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      ${({ theme }) => theme.colors.primary}40,
      ${({ theme }) => theme.colors.primary},
      ${({ theme }) => theme.colors.primary}40,
      transparent
    );
    background-size: 200% 100%;
    animation: ${shimmer} 4s ease-in-out infinite;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
    padding: 20px;
    gap: 14px;
  }
`;

const DownloadIcon = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary}0c;
  border: 1px solid ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.3rem;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 44px;
    height: 44px;
    font-size: 1.1rem;
  }
`;

const DownloadInfo = styled.div`
  flex: 1;

  .title {
    font-size: 1rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    font-family: 'Rajdhani', sans-serif;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 2px;
  }

  .sub {
    font-size: 0.76rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-family: 'Fira Code', monospace;
    opacity: 0.7;
  }
`;

const DownloadBadgeWrap = styled.div`
  flex-shrink: 0;

  a {
    display: block;
    line-height: 0;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  img {
    height: 28px;
  }
`;

const BadgesWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 130px;
  padding: 8px;
`;

/* ── HackerRank Section ───────────────────────────────────── */

const HackerRankSection = styled.div`
  padding: 40px 48px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 768px) {
    padding: 28px 24px;
  }

  @media (max-width: 480px) {
    padding: 22px 16px;
  }
`;

/* ── Boot.dev Section ─────────────────────────────────────── */

const BootDevSection = styled.div`
  padding: 40px 48px;

  @media (max-width: 768px) {
    padding: 28px 24px;
  }

  @media (max-width: 480px) {
    padding: 22px 16px;
  }
`;

const BootDevCard = styled(motion.a)`
  display: block;
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  background: rgba(255, 255, 255, 0.015);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

  /* Corner accents */
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    border: 1px solid ${({ theme }) => theme.colors.primary}30;
    pointer-events: none;
    z-index: 2;
    transition: border-color 0.3s ease;
  }

  &::before {
    top: 6px;
    left: 6px;
    border-right: none;
    border-bottom: none;
  }

  &::after {
    bottom: 6px;
    right: 6px;
    border-left: none;
    border-top: none;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary}35;
    transform: translateY(-4px);
    box-shadow: 0 16px 40px ${({ theme }) => theme.colors.primary}0a;

    &::before,
    &::after {
      border-color: ${({ theme }) => theme.colors.primary}60;
    }
  }

  img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 13px;
  }
`;

const HRCard = styled(motion.a)`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 28px;
  padding: 28px 32px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255, 255, 255, 0.015);
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;

  /* Shimmer top-border on hover */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      #bd6e52,
      #ffc5ab,
      #bd6e52,
      transparent
    );
    background-size: 200% 100%;
    opacity: 0;
    transition: opacity 0.3s ease;
    animation: ${shimmer} 3s linear infinite;
  }

  &:hover {
    border-color: rgba(189, 110, 82, 0.3);
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(189, 110, 82, 0.06);

    &::after {
      opacity: 1;
    }
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    text-align: center;
    justify-items: center;
    gap: 16px;
    padding: 24px 20px;
  }
`;

const HRBadgeIcon = styled.div`
  position: relative;
  width: 88px;
  height: 88px;
  flex-shrink: 0;

  /* Orbit ring */
  &::before {
    content: '';
    position: absolute;
    top: -8px;
    left: -8px;
    right: -8px;
    bottom: -8px;
    border-radius: 50%;
    border: 1px dashed rgba(189, 110, 82, 0.2);
    animation: ${orbitSpin} 24s linear infinite;
  }

  svg {
    width: 88px;
    height: 88px;
    filter: drop-shadow(0 6px 16px rgba(189, 110, 82, 0.2));
    transition: filter 0.3s ease;
  }

  ${HRCard}:hover & svg {
    filter: drop-shadow(0 8px 24px rgba(189, 110, 82, 0.35));
  }

  @media (max-width: 480px) {
    width: 72px;
    height: 72px;

    &::before {
      top: -6px;
      left: -6px;
      right: -6px;
      bottom: -6px;
    }

    svg {
      width: 72px;
      height: 72px;
    }
  }
`;

const HRInfo = styled.div`
  min-width: 0;
`;

const HRTitle = styled.div`
  font-size: 1.15rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  font-family: 'Rajdhani', sans-serif;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 2px;

  @media (max-width: 480px) {
    font-size: 1.05rem;
  }
`;

const HRLevel = styled.div`
  font-size: 0.88rem;
  font-weight: 600;
  color: #bd6e52;
  font-family: 'Fira Code', monospace;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;

  @media (max-width: 600px) {
    justify-content: center;
  }
`;

const HRDesc = styled.div`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  opacity: 0.75;
  line-height: 1.55;
  max-width: 440px;
  font-family: 'IBM Plex Mono', monospace;

  @media (max-width: 600px) {
    max-width: none;
  }
`;

const StarRow = styled.div`
  display: flex;
  gap: 3px;
  margin-top: 10px;

  @media (max-width: 600px) {
    justify-content: center;
  }
`;

const Star = styled.span`
  color: ${({ $filled }) => ($filled ? '#bd6e52' : 'rgba(189,110,82,0.15)')};
  font-size: 0.78rem;
  transition: color 0.3s ease, transform 0.2s ease;

  ${HRCard}:hover & {
    transform: scale(1.1);
  }
`;

const HRArrow = styled.div`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  opacity: 0.3;
  transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  flex-shrink: 0;
  font-family: 'Fira Code', monospace;

  ${HRCard}:hover & {
    opacity: 1;
    color: #bd6e52;
    transform: translateX(6px);
  }

  @media (max-width: 600px) {
    display: none;
  }
`;

/* ── Animation Variants ───────────────────────────────────── */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const sectionReveal = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/* ── Component: AnimatedStat ──────────────────────────────── */

function AnimatedStat({ icon, value, suffix, label, sub }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const numericValue = parseInt(value, 10);
  const isNumeric = !isNaN(numericValue);
  const count = useCountUp(isNumeric ? numericValue : 0, 2000, inView);

  return (
    <StatCard
      ref={ref}
      variants={itemVariants}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
    >
      <StatIcon>
        <i className={icon}></i>
      </StatIcon>
      <StatValue>
        {isNumeric ? count : value}
        {suffix && suffix}
      </StatValue>
      <StatLabel>{label}</StatLabel>
      <StatSub>{sub}</StatSub>
    </StatCard>
  );
}

/* ── Main Component ───────────────────────────────────────── */

export default function Achievements() {
  return (
    <AchievementsContainer id="achievements">
      {/* ── Header ── */}
      <Header>
        <Title
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true }}
        >
          Achievements
        </Title>
        <SubtitleLine
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <SubtitleTag>Open Source</SubtitleTag>
          <SubtitleTag>Coding Challenges</SubtitleTag>
          <SubtitleTag>Community</SubtitleTag>
        </SubtitleLine>
      </Header>

      {/* ── Single Glass Card ── */}
      <MainCard
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        viewport={{ once: true }}
      >
        <CardInner>
          {/* ── Stats Bento ── */}
          <StatsSection>
            <SectionLabel>Highlights</SectionLabel>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              <BentoGrid>
                <AnimatedStat
                  icon="fab fa-github"
                  value="50"
                  suffix="+"
                  label="Repositories"
                  sub="open source projects"
                />
                <AnimatedStat
                  icon="fas fa-download"
                  value="25000"
                  suffix="+"
                  label="ROM Downloads"
                  sub="sourceforge community"
                />
                <AnimatedStat
                  icon="fas fa-code"
                  value="5"
                  suffix="+"
                  label="Languages"
                  sub="hackerrank challenges"
                />
              </BentoGrid>
            </motion.div>
          </StatsSection>

          {/* ── GitHub ── */}
          <GitHubSection>
            <GitHubHeaderRow>
              <SectionLabel style={{ marginBottom: 0, flex: 'none' }}>
                GitHub Statistics
              </SectionLabel>
              <ProfileViewsPill>
                <span className="dot" />
                <span className="label">Views</span>
                <img
                  src="https://komarev.com/ghpvc/?username=dragonemperor9480&color=0e75b6&style=flat"
                  alt="Profile views"
                />
              </ProfileViewsPill>
            </GitHubHeaderRow>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
            >
              <GitHubGrid>
                <GitHubCard
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                >
                  <img
                    src="https://github-readme-stats.vercel.app/api?username=DragonEmperor9480&show_icons=true&theme=gotham&hide_border=true&bg_color=0d1117&title_color=64ffda&icon_color=64ffda&text_color=ffffff"
                    alt="GitHub Stats"
                    loading="lazy"
                  />
                </GitHubCard>
                <GitHubCard
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                >
                  <img
                    src="https://github-readme-streak-stats.herokuapp.com?user=DragonEmperor9480&theme=gotham&hide_border=true&background=0d1117&ring=64ffda&fire=64ffda&currStreakLabel=64ffda"
                    alt="GitHub Streak"
                    loading="lazy"
                  />
                </GitHubCard>
              </GitHubGrid>
            </motion.div>
          </GitHubSection>

          {/* ── SourceForge ── */}
          <SourceForgeSection>
            <SectionLabel>SourceForge Recognition</SectionLabel>

            <SFLayout>
              <DownloadStrip
                initial="hidden"
                whileInView="visible"
                variants={sectionReveal}
                viewport={{ once: true }}
              >
                <DownloadIcon>
                  <i className="fas fa-download"></i>
                </DownloadIcon>
                <DownloadInfo>
                  <div className="title">Dragon Emperor Builds</div>
                  <div className="sub">Custom Android ROM project</div>
                </DownloadInfo>
                <DownloadBadgeWrap>
                  <a
                    href="https://sourceforge.net/projects/dragon-emperor-builds/files/latest/download"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      alt="Download Dragon Emperor builds"
                      src="https://img.shields.io/sourceforge/dt/dragon-emperor-builds.svg?style=flat&color=64ffda&labelColor=0a192f"
                    />
                  </a>
                </DownloadBadgeWrap>
              </DownloadStrip>

              <BadgesWrapper>
                <Badges />
              </BadgesWrapper>
            </SFLayout>
          </SourceForgeSection>

          {/* ── HackerRank ── */}
          <HackerRankSection>
            <SectionLabel>HackerRank</SectionLabel>

            <HRCard
              href="https://www.hackerrank.com/profile/amruteshnaregal1"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            >
              <HRBadgeIcon>
                <svg viewBox="0 0 105 105" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                  <defs>
                    <linearGradient id="badge-bronze-gradient" x1="52.5" y1="2.5" x2="52.5" y2="102.5" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#ffc5ab"/>
                      <stop offset="1" stopColor="#ffa38a"/>
                    </linearGradient>
                  </defs>
                  <g>
                    <path fill="url(#badge-bronze-gradient)" d="M90.3892 44.9106L90.3893 44.914C90.5873 51.9976 90.3892 59.5788 89.8948 65.4581L89.8947 65.4581L89.894 65.4684C89.7459 67.8071 89.5241 69.8644 89.2548 71.4803C88.9812 73.1224 88.6689 74.2376 88.3726 74.7495L88.3684 74.7569L88.3644 74.7644C88.2249 75.0255 87.9549 75.366 87.5388 75.7853C87.1279 76.1994 86.5969 76.6683 85.9594 77.1872C84.6848 78.2247 83.011 79.4407 81.0792 80.7886C76.1371 84.1752 69.4065 88.1657 62.9661 91.6605L62.9645 91.6614C58.9514 93.8584 55.1183 95.8269 51.996 97.2447C50.4343 97.9539 49.0577 98.522 47.9293 98.9118C46.7841 99.3074 45.9476 99.5 45.4429 99.5C44.8368 99.5 43.7518 99.219 42.2485 98.6583C40.7685 98.1063 38.9475 97.3088 36.9015 96.3316C32.811 94.3779 27.849 91.7188 22.9696 88.9044C18.0901 86.09 13.3015 83.125 9.55688 80.5609C7.68397 79.2784 6.07847 78.1005 4.85537 77.0948C3.6188 76.0781 2.82774 75.2805 2.51554 74.7536C2.28519 74.3275 2.0493 73.5182 1.82917 72.3438C1.61115 71.1807 1.41751 69.7122 1.25082 68.0137C0.917563 64.6178 0.694767 60.3313 0.595718 55.7891L0.595639 55.7862C0.39748 48.597 0.496929 40.7167 0.991039 34.7412L0.991144 34.7412L0.991781 34.7309C1.13992 32.3423 1.36172 30.2598 1.63112 28.6185C1.90193 26.9685 2.21232 25.8224 2.51467 25.2483C2.86854 24.6758 3.67611 23.8504 4.9172 22.8226C6.15287 21.7992 7.77552 20.6094 9.70207 19.315L9.70402 19.3137C14.5518 16.0235 21.0868 12.0319 27.3246 8.63924L27.3247 8.63927L27.3296 8.63653C31.4393 6.34112 35.4202 4.29812 38.6657 2.83059C40.2891 2.09658 41.7217 1.5096 42.8908 1.10715C44.0779 0.698497 44.9386 0.5 45.4429 0.5C45.8599 0.5 46.5131 0.630344 47.3938 0.904038C48.2627 1.17405 49.3131 1.57058 50.508 2.07336C52.8947 3.07763 55.8302 4.49415 58.9957 6.13884L76.0424 15.9271C79.2093 17.9719 82.072 19.9123 84.2641 21.5505C85.3617 22.3708 86.285 23.1108 86.9918 23.7467C87.708 24.391 88.1652 24.8965 88.372 25.2495C88.6251 25.6975 88.8797 26.5434 89.1143 27.7675C89.346 28.9765 89.5489 30.5006 89.7217 32.2614C90.0674 35.7817 90.2902 40.2179 90.3892 44.9106Z" stroke="#bd6e52"/>
                    <g transform="translate(39, 22)">
                      <image xlinkHref="https://hrcdn.net/fcore/assets/badges/cpp-739b350881.svg" width="27" height="27"/>
                    </g>
                    <text x="52.5" y="67" fontSize="10" textAnchor="middle" dominantBaseline="middle" fill="#bd6e52">CPP</text>
                    <g transform="translate(44, 71)">
                      <svg height="10">
                        <path className="star" fill="#bd6e52" d="M55.51425,77.01983l-1.89417-.275-.84833-1.7175a.299.299,0,0,0-.27167-.16917.3245.3245,0,0,0-.2725.16917l-.305.61833-.5425,1.09916-.51417.075-1.38.2a.30333.30333,0,0,0-.18583.10083.33411.33411,0,0,0-.045.06833.35631.35631,0,0,0-.02417.07667.34087.34087,0,0,0-.005.04083.3038.3038,0,0,0,.02417.13417.33341.33341,0,0,0,.06667.0975l1.37167,1.33667-.2875,1.67167-.03667.21417c-.00167.01-.00167.02-.0025.02917l-.00167.0175a.26453.26453,0,0,0,.00167.04417.30489.30489,0,0,0,.44417.22917l1.69417-.89,1.69416.89a.30352.30352,0,0,0,.44084-.32L54.31175,78.874l1.37083-1.33667a.30339.30339,0,0,0-.16833-.5175" transform="translate(-49.22548 -74.85817)"/>
                      </svg>
                      <svg height="10" x="9">
                        <path className="star" fill="#bd6e52" d="M55.51425,77.01983l-1.89417-.275-.84833-1.7175a.299.299,0,0,0-.27167-.16917.3245.3245,0,0,0-.2725.16917l-.305.61833-.5425,1.09916-.51417.075-1.38.2a.30333.30333,0,0,0-.18583.10083.33411.33411,0,0,0-.045.06833.35631.35631,0,0,0-.02417.07667.34087.34087,0,0,0-.005.04083.3038.3038,0,0,0,.02417.13417.33341.33341,0,0,0,.06667.0975l1.37167,1.33667-.2875,1.67167-.03667.21417c-.00167.01-.00167.02-.0025.02917l-.00167.0175a.26453.26453,0,0,0,.00167.04417.30489.30489,0,0,0,.44417.22917l1.69417-.89,1.69416.89a.30352.30352,0,0,0,.44084-.32L54.31175,78.874l1.37083-1.33667a.30339.30339,0,0,0-.16833-.5175" transform="translate(-49.22548 -74.85817)"/>
                      </svg>
                    </g>
                  </g>
                </svg>
              </HRBadgeIcon>

              <HRInfo>
                <HRTitle>C++ Badge</HRTitle>
                <HRLevel>
                  <span>★★</span> Bronze Level
                </HRLevel>
                <HRDesc>
                  Earned through solving algorithmic challenges and demonstrating proficiency in C++ fundamentals, data structures, and problem solving.
                </HRDesc>
                <StarRow>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} $filled={s <= 2}>★</Star>
                  ))}
                </StarRow>
              </HRInfo>

              <HRArrow>→</HRArrow>
            </HRCard>
          </HackerRankSection>
 
          {/* ── Boot.dev ── */}
          <BootDevSection>
            <SectionLabel>Boot.dev Academy</SectionLabel>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <BootDevCard
                variants={itemVariants}
                href="https://www.boot.dev/u/73569ca0-e645-4e77-b059-d6a2f410f10e"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                style={{ maxWidth: '480px', width: '100%' }}
              >
                <img
                  src="https://api.boot.dev/v1/users/public/73569ca0-e645-4e77-b059-d6a2f410f10e/thumbnail"
                  alt="Boot.dev Profile Summary"
                  loading="lazy"
                />
              </BootDevCard>
            </motion.div>
          </BootDevSection>
        </CardInner>
      </MainCard>
    </AchievementsContainer>
  );
}
