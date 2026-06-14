'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const TerminalContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${({ theme }) => theme.colors.background};
  font-family: 'Fira Code', 'Space Mono', 'IBM Plex Mono', monospace;
  color: ${({ theme }) => theme.colors.text};
  padding: 16px;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0 0 16px 16px;
  
  /* Scanline effect */
  &::before {
    content: " ";
    display: ${({ theme }) => theme.name === 'Light Mode' ? 'none' : 'block'};
    position: absolute;
    top: 0; left: 0; bottom: 0; right: 0;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
    z-index: 10;
    background-size: 100% 3px, 3px 100%;
    pointer-events: none;
  }
`;

const OutputArea = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.82rem;
  padding-right: 4px;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.03)' : 'rgba(0,0,0,0.3)'};
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.15)' : `${theme.colors.primary}40`};
    border-radius: 3px;
  }
`;

const OutputLine = styled.div`
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-all;
  color: ${({ $type, theme }) => {
    const isLight = theme.name === 'Light Mode';
    if ($type === 'error') return isLight ? '#dc2626' : '#ff3366';
    if ($type === 'success') return isLight ? '#16a34a' : (theme.colors.primary || '#00ff41');
    if ($type === 'info') return isLight ? '#2563eb' : '#01cdfe';
    if ($type === 'warning') return isLight ? '#d97706' : '#faef5d';
    return theme.colors.text;
  }};
  text-shadow: ${({ $type, theme }) => {
    if (theme.name === 'Light Mode') return 'none';
    if ($type === 'error') return '0 0 3px rgba(255, 51, 102, 0.4)';
    if ($type === 'success') return `0 0 3px ${theme.colors.primary || '#00ff41'}66`;
    if ($type === 'info') return '0 0 3px rgba(1, 205, 254, 0.4)';
    return 'none';
  }};
`;

const CommandLine = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  border-top: 1px dashed ${({ theme }) => theme.colors.border};
  padding-top: 8px;
  flex-shrink: 0;
  z-index: 5;
`;

const InputPrompt = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
`;

const CustomInput = styled.input`
  flex-grow: 1;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: inherit;
  outline: none;
  caret-color: ${({ theme }) => theme.colors.primary};
  text-shadow: ${({ theme }) => theme.name === 'Light Mode' ? 'none' : `0 0 3px ${theme.colors.primary}40`};
`;

/* ─── Lockpicking Mini-Game Styled Components ────────────────────── */
const GameOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(245, 245, 245, 0.98)' : 'rgba(13, 2, 8, 0.95)'};
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
  color: ${({ theme }) => theme.colors.text};
`;

const GameTrack = styled.div`
  width: 100%;
  max-width: 380px;
  height: 24px;
  background: ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 255, 65, 0.3)'};
  border-radius: 12px;
  position: relative;
  margin: 24px 0;
  overflow: hidden;
`;

const TargetZone = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 42%;
  width: 16%;
  background: ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(22, 163, 74, 0.2)' : 'rgba(0, 255, 65, 0.25)'};
  border-left: 1px solid ${({ theme }) => theme.name === 'Light Mode' ? '#16a34a' : '#00ff41'};
  border-right: 1px solid ${({ theme }) => theme.name === 'Light Mode' ? '#16a34a' : '#00ff41'};
  box-shadow: 0 0 10px ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(22, 163, 74, 0.15)' : 'rgba(0, 255, 65, 0.3)'} inset;
`;

const SweepLine = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${({ $pos }) => $pos}%;
  width: 3px;
  background: #ff3366;
  box-shadow: ${({ theme }) => theme.name === 'Light Mode' ? 'none' : '0 0 10px #ff3366, 0 0 4px #ff3366'};
`;

const BypassButton = styled(motion.button)`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.name === 'Light Mode' ? '#dc2626' : '#ff3366'};
  color: ${({ theme }) => theme.name === 'Light Mode' ? '#dc2626' : '#ff3366'};
  padding: 10px 24px;
  font-family: inherit;
  font-size: 0.85rem;
  border-radius: 8px;
  cursor: pointer;
  text-shadow: ${({ theme }) => theme.name === 'Light Mode' ? 'none' : '0 0 4px rgba(255, 51, 102, 0.4)'};
  box-shadow: ${({ theme }) => theme.name === 'Light Mode' ? 'none' : '0 0 8px rgba(255, 51, 102, 0.1)'};

  &:hover {
    background: ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(220, 38, 38, 0.05)' : 'rgba(255, 51, 102, 0.08)'};
    box-shadow: ${({ theme }) => theme.name === 'Light Mode' ? 'none' : '0 0 12px rgba(255, 51, 102, 0.3)'};
  }
`;

const HeartContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
`;

const HeartIcon = styled.i`
  color: ${({ $active, theme }) => $active ? '#ff3366' : (theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 51, 102, 0.2)')};
  text-shadow: ${({ $active, theme }) => ($active && theme.name !== 'Light Mode') ? '0 0 6px #ff3366' : 'none'};
  font-size: 0.9rem;
`;

// ASCII Art Logo
const ASCII_LOGO = `
   ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
   █   ▄▄▄▄   █ █ █ █ █ █ █ █ █ █ █ █ █ 
   █ █ ████ █ █   █   ███ █ █ █ █   █ █ 
   █ █ █  █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ 
   █ █ █▀▀█ █ █ █ █ █ █ █ █ █ █ █ █ █ █ 
   █ █ █▄▄█ █ █ █ █ █ █▄ ▀ ▄██▄ █ █ █ █ 
   ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
`;

export default function TerminalApp() {
  const { currentTheme, setCurrentTheme } = useTheme();
  const [history, setHistory] = useState([
    { text: 'SYSTEM INTRUSION DETECTED // PORTFOLIO CYBER LINK v2.1', type: 'warning' },
    { text: 'Type "help" to display available systems logs & commands.', type: 'info' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [gameActive, setGameActive] = useState(false);
  const [sweepPos, setSweepPos] = useState(0);
  const [attempts, setAttempts] = useState(3);

  const outputRef = useRef(null);
  const gameLoopRef = useRef(null);
  const sweepDirRef = useRef(1); // 1 = right, -1 = left

  // Auto-scroll log outputs
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  // Synthesize chimes using Web Audio API
  const playSound = useCallback((type) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        // High-pitched retro arpeggio chime
        const now = ctx.currentTime;
        osc.type = 'triangle';
        gain.gain.setValueAtTime(0.2, now);
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.start(now);
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.stop(now + 0.5);
      } else if (type === 'fail') {
        // Low sawtooth buzz
        const now = ctx.currentTime;
        osc.type = 'sawtooth';
        gain.gain.setValueAtTime(0.3, now);
        osc.frequency.setValueAtTime(130.81, now); // C3
        osc.start(now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.stop(now + 0.4);
      } else if (type === 'ping') {
        // Quick high blip
        const now = ctx.currentTime;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.08, now);
        osc.frequency.setValueAtTime(880, now); // A5
        osc.start(now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.stop(now + 0.08);
      }
    } catch {
      // AudioContext blocked or not supported
    }
  }, []);

  // Sweep-line animation loop for the bypass game
  useEffect(() => {
    if (!gameActive) return;

    const animateSweep = () => {
      setSweepPos((prev) => {
        let next = prev + sweepDirRef.current * 2.2;
        if (next >= 100) {
          next = 100;
          sweepDirRef.current = -1;
        } else if (next <= 0) {
          next = 0;
          sweepDirRef.current = 1;
        }
        return next;
      });
      gameLoopRef.current = requestAnimationFrame(animateSweep);
    };

    gameLoopRef.current = requestAnimationFrame(animateSweep);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [gameActive]);

  const triggerBypass = useCallback(() => {
    if (!gameActive) return;

    // Target zone is between 42% and 58%
    const isSuccess = sweepPos >= 42 && sweepPos <= 58;

    if (isSuccess) {
      playSound('success');
      setGameActive(false);
      setHistory((prev) => [
        ...prev,
        { text: '> BYPASS SUCCESSFUL: GRID SYSTEM COMPROMISED.', type: 'success' },
        { text: '> SECURE THE MATRIX CORE...', type: 'success' },
        { text: '> SWITCHING PORTFOLIO INJECTOR TO MATRIX GREEN.', type: 'info' }
      ]);
      setCurrentTheme('matrix');
    } else {
      playSound('fail');
      const nextAttempts = attempts - 1;
      setAttempts(nextAttempts);

      if (nextAttempts <= 0) {
        setGameActive(false);
        setHistory((prev) => [
          ...prev,
          { text: '> BYPASS ATTEMPTS EXCEEDED. COLD EXPLOIT TERMINATED.', type: 'error' },
          { text: '> SYSTEM SECURED AND IPS LOGGED.', type: 'error' }
        ]);
      } else {
        setHistory((prev) => [
          ...prev,
          { text: `> BYPASS FAILURE: STACK MISALIGNMENT. ATTEMPTS REMAINING: ${nextAttempts}`, type: 'error' }
        ]);
      }
    }
  }, [gameActive, sweepPos, attempts, setCurrentTheme, playSound]);

  // Handle game input via Spacebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameActive && e.key === ' ') {
        e.preventDefault();
        triggerBypass();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameActive, triggerBypass]);

  const executeCommand = (cmd) => {
    const cleaned = cmd.trim();
    const args = cleaned.split(' ');
    const primaryCmd = args[0].toLowerCase();

    setHistory((prev) => [...prev, { text: `guest@portfolio:~$ ${cleaned}`, type: 'default' }]);

    switch (primaryCmd) {
      case 'help':
        setHistory((prev) => [
          ...prev,
          { text: 'PORTFOLIO CYBER SHELL COMMAND INVENTORY:', type: 'warning' },
          { text: '  help       - Display available systems logs & commands.', type: 'default' },
          { text: '  neofetch   - Summarises system stats in ascii art.', type: 'default' },
          { text: '  matrix     - Deploys sweeps mini-game to unlock the matrix green theme.', type: 'default' },
          { text: '  ping       - Test response latency against server modules.', type: 'default' },
          { text: '  themes     - List available themes or switch to them (e.g. "themes dark").', type: 'default' },
          { text: '  clear      - Purge output display logs.', type: 'default' }
        ]);
        break;

      case 'neofetch':
        setHistory((prev) => [
          ...prev,
          { text: ASCII_LOGO, type: 'success' },
          { text: `USER: guest@guest-pc\nOS: Amrutesh Portfolio OS v2.1.0\nHOST: React Viewport Layer\nUPTIME: 46m\nSHELL: Custom CyberShell v1\nRESOLUTION: ${window.innerWidth}x${window.innerHeight}\nTHEME: ${currentTheme}\nCPU: Virtual Decryptor Core 4x\nMEMORY: 2.41GB / 8.00GB`, type: 'info' }
        ]);
        break;

      case 'clear':
        setHistory([]);
        break;

      case 'matrix':
        setAttempts(3);
        setSweepPos(0);
        sweepDirRef.current = 1;
        setGameActive(true);
        setHistory((prev) => [
          ...prev,
          { text: '> INITIALISING QUANTUM SECURE OVERRIDE...', type: 'warning' },
          { text: '> PRESS SPACEBAR OR CLICK BYPASS WHEN RED SWEEPER TOUCHES GREEN RANGE.', type: 'warning' }
        ]);
        break;

      case 'ping':
        setHistory((prev) => [...prev, { text: '> PING ingress.github.com (140.82.121.4): 56 data bytes', type: 'info' }]);
        
        // Output pings with slight delays
        [1, 2, 3, 4].forEach((seq) => {
          setTimeout(() => {
            playSound('ping');
            const latency = (Math.random() * 40 + 15).toFixed(1);
            setHistory((prev) => [
              ...prev,
              { text: `64 bytes from 140.82.121.4: icmp_seq=${seq} ttl=53 time=${latency} ms`, type: 'info' }
            ]);
            if (seq === 4) {
              setHistory((prev) => [
                ...prev,
                { text: '\n--- ingress.github.com ping statistics ---', type: 'info' },
                { text: '4 packets transmitted, 4 received, 0% packet loss, time 3004ms', type: 'success' }
              ]);
            }
          }, seq * 400);
        });
        break;

      case 'themes':
        if (args.length === 1) {
          setHistory((prev) => [
            ...prev,
            { text: 'AVAILABLE PORTFOLIO THEMES:', type: 'warning' },
            { text: '  black, dark, light, neon, cyberpunk, matrix, synthwave, retro, nord, mint, lavender', type: 'default' },
            { text: '\nRun "themes [themeName]" to apply (e.g. "themes cyberpunk")', type: 'info' }
          ]);
        } else {
          const requestedTheme = args[1].toLowerCase();
          const validThemes = ['black', 'dark', 'light', 'neon', 'cyberpunk', 'matrix', 'synthwave', 'retro', 'nord', 'mint', 'lavender'];
          if (validThemes.includes(requestedTheme)) {
            setCurrentTheme(requestedTheme);
            setHistory((prev) => [...prev, { text: `> Active theme overridden to [${requestedTheme}] successfully.`, type: 'success' }]);
          } else {
            setHistory((prev) => [...prev, { text: `> Error: Theme [${requestedTheme}] not found.`, type: 'error' }]);
          }
        }
        break;

      default:
        setHistory((prev) => [
          ...prev,
          { text: `CyberShell: command not found: "${cleaned}". Type "help" for a list of diagnostics commands.`, type: 'error' }
        ]);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    executeCommand(inputValue);
    setInputValue('');
  };

  return (
    <TerminalContainer>
      <OutputArea ref={outputRef}>
        {history.map((line, idx) => (
          <OutputLine key={idx} $type={line.type}>
            {line.text}
          </OutputLine>
        ))}
      </OutputArea>

      <form onSubmit={handleFormSubmit}>
        <CommandLine>
          <InputPrompt>guest@portfolio:~$</InputPrompt>
          <CustomInput
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={gameActive}
            placeholder={gameActive ? 'Bypass game active...' : 'Enter system command...'}
            autoFocus
          />
        </CommandLine>
      </form>

      {/* Embedded Sweep-line Hacking Game Overlay */}
      <AnimatePresence>
        {gameActive && (
          <GameOverlay
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <span style={{ fontSize: '0.65rem', color: '#ff3366', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              Intrusion Active
            </span>
            <h4 style={{ margin: '8px 0 16px 0', fontFamily: 'inherit', color: '#ff3366', fontSize: '1rem', textShadow: '0 0 5px rgba(255, 51, 102, 0.4)' }}>
              MATRIX DECRYPT SECURITY BYPASS
            </h4>
            
            <HeartContainer>
              {[...Array(3)].map((_, i) => (
                <HeartIcon key={i} className="fas fa-heart" $active={i < attempts} />
              ))}
            </HeartContainer>

            <GameTrack>
              <TargetZone />
              <SweepLine $pos={sweepPos} />
            </GameTrack>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <BypassButton onClick={triggerBypass} whileTap={{ scale: 0.95 }}>
                BYPASS SECURITY
              </BypassButton>
              <span style={{ fontSize: '0.65rem', color: '#555', fontFamily: 'inherit' }}>
                HOTKEY: [SPACEBAR] TO BYPASS LOCK
              </span>
            </div>
          </GameOverlay>
        )}
      </AnimatePresence>
    </TerminalContainer>
  );
}
