import styled, { keyframes } from 'styled-components';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const BLINK = keyframes`
  50% { opacity: 0; }
`;

const SkeletonContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #05080c;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  font-family: 'Fira Code', 'JetBrains Mono', monospace;
  overflow: hidden;
  padding: 20px;

  /* Background grid lines for terminal immersion */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(100, 255, 218, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(100, 255, 218, 0.02) 1px, transparent 1px);
    background-size: 30px 30px;
    pointer-events: none;
    z-index: 1;
  }
`;

const GlowBlob = styled(motion.div)`
  position: absolute;
  width: ${props => props.$size || '250px'};
  height: ${props => props.$size || '250px'};
  border-radius: 50%;
  background: ${props => props.$color};
  filter: blur(80px);
  opacity: 0.12;
  pointer-events: none;
  z-index: 2;
`;

const ConstellationNetwork = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = [];
    const particleCount = 45;
    const connectionDistance = 110;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: 1 + Math.random() * 1.5,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(100, 255, 218, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx = -p.vx;
        if (p.y < 0 || p.y > height) p.vy = -p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(100, 255, 218, 0.35)';
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
        opacity: 0.65,
      }}
    />
  );
};

const TerminalWindow = styled(motion.div)`
  background: rgba(10, 15, 24, 0.85);
  backdrop-filter: blur(16px);
  border-radius: 12px;
  width: 100%;
  max-width: 650px;
  border: 1px solid rgba(100, 255, 218, 0.15);
  box-shadow: 
    0 15px 50px rgba(0, 0, 0, 0.6),
    0 0 30px rgba(100, 255, 218, 0.05);
  position: relative;
  z-index: 10;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const TerminalHeader = styled.div`
  background: rgba(5, 8, 12, 0.8);
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid rgba(100, 255, 218, 0.1);
  user-select: none;
`;

const WindowControls = styled.div`
  display: flex;
  gap: 8px;
`;

const Dot = styled.div`
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background-color: ${props => props.color};
  opacity: 0.8;
`;

const WindowTitle = styled.div`
  color: rgba(100, 255, 218, 0.75);
  font-size: 0.78rem;
  letter-spacing: 0.05em;
  font-weight: 500;
`;

const LogArea = styled.div`
  height: 280px;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: rgba(5, 8, 12, 0.3);
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const LogLine = styled.div`
  font-size: 0.8rem;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.85);
  white-space: pre-wrap;
  word-break: break-all;
`;

const StatusOk = styled.span`
  color: #00ff88;
  font-weight: bold;
`;

const StatusInfo = styled.span`
  color: #38bdf8;
`;

const StatusWarn = styled.span`
  color: #fb923c;
`;

const InteractiveCommand = styled.div`
  font-size: 0.82rem;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
`;

const PromptPrefix = styled.span`
  color: #64ffda;
  font-weight: bold;
`;

const Cursor = styled.span`
  display: inline-block;
  width: 8px;
  height: 14px;
  background: #64ffda;
  animation: ${BLINK} 1s step-end infinite;
  vertical-align: middle;
  margin-left: 2px;
`;

const LoadingSection = styled.div`
  padding: 18px 20px 22px;
  background: rgba(5, 8, 12, 0.85);
  border-top: 1px solid rgba(100, 255, 218, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const LoadingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.95rem;
  color: #ffffff;
`;

const FriendlyStatus = styled.span`
  color: #64ffda;
  text-shadow: 0 0 8px rgba(100, 255, 218, 0.2);
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid rgba(100, 255, 218, 0.1);
  position: relative;
`;

const ProgressGlow = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #64ffda, #00ff88);
  box-shadow: 0 0 10px rgba(100, 255, 218, 0.5);
  border-radius: 4px;
`;

const BOOT_LOGS = [
  { text: 'Initializing cgroup subsys cpu...', type: 'info' },
  { text: 'Linux version 6.9.3-arch-lambda (gcc version 14.1.1)', type: 'info' },
  { text: 'ACPI: Core revision 20260101', type: 'info' },
  { text: 'Secure Boot: disabled (bypass custom signature)', type: 'warn' },
  { text: 'nvme0n1: mapped partition table: dev/nvme0n1p2 [OK]', type: 'ok' },
  { text: 'systemd[1]: System time before journal start, rotating logs.', type: 'info' },
  { text: 'systemd[1]: Inserted module \'autofs4\' successfully.', type: 'ok' },
  { text: 'systemd[1]: Created slice User and Session Slice.', type: 'ok' },
  { text: 'systemd[1]: Started Dispatch Password Requests to Console.', type: 'ok' },
  { text: 'systemd[1]: Started Load/Save Random Seed.', type: 'ok' },
  { text: 'systemd[1]: Started Apply Kernel Variables.', type: 'ok' },
  { text: 'systemd[1]: Started Create Static Device Nodes in /dev.', type: 'ok' },
  { text: 'systemd[1]: Started Rule-based Manager for Device Events.', type: 'ok' },
  { text: 'systemd[1]: Mounted /boot/efi (FAT32 partition).', type: 'ok' },
  { text: 'systemd[1]: Started System Logging Service (syslogd).', type: 'ok' },
  { text: 'systemd[1]: Started D-Bus System Message Bus.', type: 'ok' },
  { text: 'systemd[1]: Started Network Configuration Daemon.', type: 'ok' },
  { text: 'systemd[1]: Started User Manager for UID 1000.', type: 'ok' },
  { text: 'systemd[1]: Reached target Multi-User System.', type: 'ok' },
  { text: 'systemd[1]: Reached target Graphical Interface.', type: 'ok' }
];

export default function SkeletonLoader({ onComplete }) {
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [friendlyStatus, setFriendlyStatus] = useState('Loading System Boot...');
  const [loginState, setLoginState] = useState('logs'); // 'logs' | 'login' | 'command' | 'finishing'
  const [commandText, setCommandText] = useState('');
  
  const logAreaRef = useRef(null);

  // Parallax motion tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring configuration to filter out hand tremors/jerks
  const springConfig = { stiffness: 60, damping: 20, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    mouseX.set(clientX - centerX);
    mouseY.set(clientY - centerY);
  };

  // Device orientation (tilt) parallax for mobile support
  useEffect(() => {
    const handleOrientation = (e) => {
      const { beta, gamma } = e; // beta: -180 to 180, gamma: -90 to 90
      if (beta === null || gamma === null) return;
      
      // Comfort tilt range: -30 to 30 degrees. Translate to matching pixel offsets
      const xOffset = Math.max(-30, Math.min(30, gamma)) * 8;
      
      // Comfort tilt range: 15 to 75 degrees. Offset by 45 degrees
      const yOffset = (Math.max(15, Math.min(75, beta)) - 45) * 8;
      
      mouseX.set(xOffset);
      mouseY.set(yOffset);
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [mouseX, mouseY]);

  // Layered translation offsets
  const canvasX = useTransform(smoothX, (val) => val * 0.015);
  const canvasY = useTransform(smoothY, (val) => val * 0.015);

  const blob1X = useTransform(smoothX, (val) => val * 0.03);
  const blob1Y = useTransform(smoothY, (val) => val * 0.03);

  const blob2X = useTransform(smoothX, (val) => val * -0.02);
  const blob2Y = useTransform(smoothY, (val) => val * -0.02);

  const blob3X = useTransform(smoothX, (val) => val * 0.04);
  const blob3Y = useTransform(smoothY, (val) => val * 0.04);

  // Auto-scroll logs to bottom
  useEffect(() => {
    if (logAreaRef.current) {
      logAreaRef.current.scrollTop = logAreaRef.current.scrollHeight;
    }
  }, [logs, loginState, commandText]);

  useEffect(() => {
    let logIndex = 0;
    
    // 1. Print systemd boot logs rapidly
    const logTimer = setInterval(() => {
      if (logIndex < BOOT_LOGS.length) {
        const nextLog = BOOT_LOGS[logIndex];
        setLogs(prev => [...prev, nextLog]);
        
        // Progress builds up to 75% during startup logs
        const logProgress = Math.floor((logIndex / BOOT_LOGS.length) * 75);
        setProgress(logProgress);

        // Friendly user status updates depending on stages
        if (logIndex === 0) setFriendlyStatus('Booting kernel modules...');
        if (logIndex === 4) setFriendlyStatus('Configuring system volumes...');
        if (logIndex === 10) setFriendlyStatus('Starting network interface daemon...');
        if (logIndex === 15) setFriendlyStatus('Initializing environment services...');

        logIndex++;
      } else {
        clearInterval(logTimer);
        setFriendlyStatus('System online. Launching login shell...');
        
        // 2. Transition to login prompt
        setTimeout(() => {
          setLoginState('login');
          setProgress(80);
          
          // 3. Start typing command sequence
          setTimeout(() => {
            setLoginState('command');
            setFriendlyStatus('Executing desktop initiation script...');
            
            const targetCommand = 'launch --desktop';
            let charIndex = 0;
            
            const typingInterval = setInterval(() => {
              if (charIndex <= targetCommand.length) {
                setCommandText(targetCommand.slice(0, charIndex));
                // Scale progress from 80% to 100%
                const typingProgress = 80 + Math.floor((charIndex / targetCommand.length) * 20);
                setProgress(typingProgress);
                charIndex++;
              } else {
                clearInterval(typingInterval);
                setLoginState('finishing');
                setFriendlyStatus('Launching Graphical Portfolio Environment...');
                
                // 4. Trigger onComplete to fade loader screen
                setTimeout(() => {
                  if (onComplete) onComplete();
                }, 45000); // Set to small interval, overridden below by trigger
              }
            }, 60);
          }, 600);
        }, 300);
      }
    }, 45);

    return () => {
      clearInterval(logTimer);
    };
  }, []);

  // Quick fallback safety timeout to execute onComplete
  useEffect(() => {
    if (loginState === 'finishing') {
      const finishTimer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 500);
      return () => clearTimeout(finishTimer);
    }
  }, [loginState, onComplete]);

  const renderLogType = (type) => {
    switch (type) {
      case 'ok':
        return <StatusOk>[  OK  ]</StatusOk>;
      case 'info':
        return <StatusInfo>[ INFO ]</StatusInfo>;
      case 'warn':
        return <StatusWarn>[ WARN ]</StatusWarn>;
      default:
        return <span>[ LOG  ]</span>;
    }
  };

  return (
    <SkeletonContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.45, ease: 'easeInOut' } }}
      onMouseMove={handleMouseMove}
    >
      {/* Deepest layer: Constellation network (moves slowest) */}
      <motion.div style={{ x: canvasX, y: canvasY, position: 'absolute', inset: 0, zIndex: 1 }}>
        <ConstellationNetwork />
      </motion.div>

      {/* Mid layers: Floating background blobs (move independently with cursor offset) */}
      <motion.div style={{ x: blob1X, y: blob1Y, position: 'absolute', inset: 0, zIndex: 2 }}>
        <GlowBlob
          $color="#64ffda"
          $size="300px"
          style={{ top: '10%', left: '10%' }}
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -30, 40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      <motion.div style={{ x: blob2X, y: blob2Y, position: 'absolute', inset: 0, zIndex: 2 }}>
        <GlowBlob
          $color="#7c3aed"
          $size="350px"
          style={{ bottom: '15%', right: '10%' }}
          animate={{
            x: [0, -40, 50, 0],
            y: [0, 30, -40, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      <motion.div style={{ x: blob3X, y: blob3Y, position: 'absolute', inset: 0, zIndex: 2 }}>
        <GlowBlob
          $color="#00ff88"
          $size="250px"
          style={{ top: '45%', right: '35%' }}
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -20, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      <TerminalWindow
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* Terminal Header Bar */}
        <TerminalHeader>
          <WindowControls>
            <Dot color="#ff5f56" />
            <Dot color="#ffbd2e" />
            <Dot color="#27c93f" />
          </WindowControls>
          <WindowTitle>shura@portfolio: ~ (tty1)</WindowTitle>
          <div style={{ width: '48px' }} /> {/* Spacer */}
        </TerminalHeader>

        {/* Scrollable logs area */}
        <LogArea ref={logAreaRef}>
          {logs.map((log, idx) => (
            <LogLine key={idx}>
              {renderLogType(log.type)} {log.text}
            </LogLine>
          ))}

          {/* Login prompt stage */}
          {(loginState === 'login' || loginState === 'command' || loginState === 'finishing') && (
            <div style={{ marginTop: '12px' }}>
              <LogLine>shura-portfolio login: shura (automatic login)</LogLine>
              <LogLine>Last login: Sat Jun 6 19:18:57 on tty1</LogLine>
              <LogLine style={{ color: '#64ffda', fontWeight: 600 }}>Welcome to Arch Linux (x86_64 kernel)</LogLine>
            </div>
          )}

          {/* Typing Command execution simulation */}
          {(loginState === 'command' || loginState === 'finishing') && (
            <InteractiveCommand>
              <PromptPrefix>shura@portfolio:~$</PromptPrefix>
              <span>{commandText}</span>
              {loginState === 'command' && <Cursor />}
            </InteractiveCommand>
          )}

          {/* System startup desktop launch message */}
          {loginState === 'finishing' && (
            <div style={{ marginTop: '8px', color: '#00ff88', fontWeight: 600, fontSize: '0.8rem' }}>
              <span>&gt; Launching Desktop GUI... OK</span>
            </div>
          )}
        </LogArea>

        {/* High-level Loading progress indicators (Friendly for regular visitors) */}
        <LoadingSection>
          <LoadingHeader>
            <FriendlyStatus>{friendlyStatus}</FriendlyStatus>
            <span style={{ color: '#ffffff', opacity: 0.85 }}>{progress}%</span>
          </LoadingHeader>

          <ProgressBar>
            <ProgressGlow
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </ProgressBar>
        </LoadingSection>
      </TerminalWindow>
    </SkeletonContainer>
  );
}