import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const SkeletonContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: 
    radial-gradient(circle at 20% 20%, rgba(0, 255, 127, 0.08) 0%, transparent 40%),
    radial-gradient(circle at 80% 80%, rgba(74, 171, 247, 0.06) 0%, transparent 40%),
    radial-gradient(circle at 50% 10%, rgba(255, 139, 19, 0.04) 0%, transparent 50%),
    radial-gradient(circle at 10% 90%, rgba(81, 207, 102, 0.05) 0%, transparent 40%),
    linear-gradient(135deg, #0a0a0a 0%, #1a0f0f 25%, #0f1a0f 50%, #0a0f1a 75%, #0a0a0a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  font-family: 'JetBrains Mono', 'SF Mono', monospace;
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 80px,
        rgba(0, 255, 127, 0.02) 80px,
        rgba(0, 255, 127, 0.02) 82px
      ),
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 120px,
        rgba(74, 171, 247, 0.015) 120px,
        rgba(74, 171, 247, 0.015) 122px
      );
    animation: gridFlow 8s linear infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 12px;
    color: rgba(0, 255, 127, 0.7);
    font-family: 'JetBrains Mono', monospace;
    content: '[LINUX TERMINAL READY]';
    animation: terminalBlink 2s infinite;
  }
  
  @keyframes gridFlow {
    0% { transform: translate(0, 0); }
    100% { transform: translate(20px, 20px); }
  }
  
  @keyframes terminalBlink {
    0%, 70% { opacity: 1; }
    71%, 100% { opacity: 0.4; }
  }
`;

// Add geometric background elements
const GeometricBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  
  .hex {
    position: absolute;
    width: 60px;
    height: 60px;
    border: 1px solid rgba(0, 255, 127, 0.05);
    transform: rotate(45deg);
    animation: hexFloat 12s ease-in-out infinite;
    
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 30px;
      height: 30px;
      border: 1px solid rgba(74, 171, 247, 0.03);
      transform: translate(-50%, -50%) rotate(45deg);
    }
    
    &:nth-child(2n) {
      animation-delay: -3s;
      border-color: rgba(74, 171, 247, 0.04);
    }
    
    &:nth-child(3n) {
      animation-delay: -6s;
      border-color: rgba(255, 139, 19, 0.03);
    }
    
    &:nth-child(4n) {
      animation-delay: -9s;
      border-color: rgba(81, 207, 102, 0.04);
    }
  }
  
  @keyframes hexFloat {
    0%, 100% {
      transform: rotate(45deg) translateY(0px);
      opacity: 0.3;
    }
    50% {
      transform: rotate(225deg) translateY(-20px);
      opacity: 0.1;
    }
  }
`;

// Add data stream lines
const DataStreams = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  
  .stream {
    position: absolute;
    width: 2px;
    background: linear-gradient(180deg, 
      transparent 0%, 
      rgba(0, 255, 127, 0.4) 50%, 
      transparent 100%
    );
    animation: streamFlow 8s linear infinite;
    
    &:nth-child(2n) {
      background: linear-gradient(180deg, 
        transparent 0%, 
        rgba(74, 171, 247, 0.3) 50%, 
        transparent 100%
      );
      animation-duration: 10s;
      animation-delay: -2s;
    }
    
    &:nth-child(3n) {
      background: linear-gradient(180deg, 
        transparent 0%, 
        rgba(255, 139, 19, 0.2) 50%, 
        transparent 100%
      );
      animation-duration: 12s;
      animation-delay: -4s;
    }
  }
  
  @keyframes streamFlow {
    0% {
      height: 0px;
      top: 0%;
    }
    50% {
      height: 200px;
      top: 30%;
    }
    100% {
      height: 0px;
      top: 100%;
    }
  }
`;

const LoaderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  text-align: center;
  width: 100%;
  max-width: 1200px;
  padding: 20px;
`;

const Brand = styled(motion.div)`
  .title {
    font-size: 48px;
    font-weight: 700;
    background: linear-gradient(135deg, #ffffff 0%, #00ff7f 30%, #ff4444 70%, #ff8b13 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 12px;
    letter-spacing: 2px;
    text-shadow: 0 0 30px rgba(255, 68, 68, 0.3);
    position: relative;
    
    &::after {
      content: '●';
      position: absolute;
      top: -10px;
      right: -20px;
      font-size: 12px;
      color: #ff4444;
      animation: securityDot 2s infinite;
    }
  }
  
  .subtitle {
    font-size: 18px;
    color: #64748b;
    font-weight: 400;
    letter-spacing: 1px;
    position: relative;
    
    &::before {
      content: '$ sudo ./portfolio --init ';
      color: #00ff7f;
      font-size: 12px;
      opacity: 0.7;
      animation: terminalCursor 1s infinite;
    }
    
    &::after {
      content: '_';
      color: #00ff7f;
      font-size: 14px;
      animation: cursorBlink 1s infinite;
      margin-left: 4px;
    }
  }
  
  @keyframes securityDot {
    0%, 100% { color: #ff4444; }
    50% { color: #00ff7f; }
  }
  
  @keyframes terminalCursor {
    0%, 50% { opacity: 0.7; }
    51%, 100% { opacity: 0.3; }
  }
  
  @keyframes cursorBlink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
  
  @media (max-width: 768px) {
    .title { font-size: 36px; }
    .subtitle { font-size: 16px; }
  }
`;

const SkillsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 900px;
  margin: 20px 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    margin: 16px 0;
    padding: 0 10px;
  }
  
  @media (max-width: 480px) {
    padding: 0 5px;
    gap: 12px;
  }
`;

const SkillCard = styled(motion.div)`
  background: 
    linear-gradient(145deg, 
      rgba(13, 17, 23, 0.9) 0%, 
      rgba(22, 27, 34, 0.8) 100%
    );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 68, 68, 0.3);
  border-radius: 12px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  min-height: 140px;
  
  &:hover {
    border-color: ${props => props.accentColor || '#00ff7f'};
    box-shadow: 0 8px 32px ${props => props.accentColor || '#00ff7f'}20;
    transform: translateY(-2px);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #ff4444, ${props => props.accentColor || '#00ff7f'}, ${props => props.secondaryColor || '#ff8b13'});
  }
  
  &::after {
    content: '[VERIFIED]';
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: 8px;
    color: rgba(0, 255, 127, 0.6);
    font-weight: 600;
    letter-spacing: 0.5px;
  }
  
  .icon {
    font-size: 28px;
    margin-bottom: 12px;
    display: block;
  }
  
  .title {
    font-size: 16px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 8px;
    letter-spacing: 0.5px;
  }
  
  .description {
    font-size: 13px;
    color: #7d8590;
    line-height: 1.4;
    margin-bottom: 40px;
  }
  
  .status {
    position: absolute;
    bottom: 12px;
    right: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: ${props => props.accentColor || '#00ff7f'};
    font-weight: 600;
    
    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: ${props => props.accentColor || '#00ff7f'};
      animation: pulse 2s infinite;
    }
  }
  
  @media (max-width: 768px) {
    padding: 20px;
    min-height: 120px;
    
    .icon {
      font-size: 24px;
      margin-bottom: 10px;
    }
    
    .title {
      font-size: 15px;
      margin-bottom: 6px;
    }
    
    .description {
      font-size: 12px;
      margin-bottom: 35px;
      line-height: 1.3;
    }
    
    .status {
      font-size: 10px;
      bottom: 10px;
      right: 10px;
      gap: 4px;
      
      .dot {
        width: 5px;
        height: 5px;
      }
    }
    
    &::after {
      font-size: 7px;
      top: 6px;
      right: 6px;
    }
  }
  
  @media (max-width: 480px) {
    padding: 16px;
    min-height: 110px;
    border-radius: 8px;
    
    .icon {
      font-size: 22px;
      margin-bottom: 8px;
    }
    
    .title {
      font-size: 14px;
      margin-bottom: 5px;
    }
    
    .description {
      font-size: 11px;
      margin-bottom: 30px;
    }
    
    .status {
      font-size: 9px;
      bottom: 8px;
      right: 8px;
      
      .dot {
        width: 4px;
        height: 4px;
      }
    }
    
    &::after {
      font-size: 6px;
      top: 4px;
      right: 4px;
    }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const ProgressContainer = styled(motion.div)`
  width: 500px;
  max-width: 85vw;
  position: relative;
  
  &::before {
    content: '[SECURITY LEVEL: MAXIMUM]';
    position: absolute;
    top: -20px;
    left: 0;
    font-size: 10px;
    color: rgba(255, 68, 68, 0.7);
    font-weight: 600;
    letter-spacing: 0.5px;
  }
  
  .progress-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    .status {
      font-size: 14px;
      color: #94a3b8;
      font-weight: 500;
      
      &::before {
        content: '> ';
        color: #ff4444;
        font-weight: 700;
      }
    }
    
    .percentage {
      font-size: 16px;
      color: #00ff7f;
      font-weight: 700;
      font-family: 'SF Mono', monospace;
      
      &::after {
        content: ' [OK]';
        font-size: 10px;
        color: #ff4444;
        margin-left: 4px;
      }
    }
  }
  
  .progress-track {
    width: 100%;
    height: 4px;
    background: rgba(100, 116, 139, 0.2);
    border-radius: 2px;
    overflow: hidden;
    border: 1px solid rgba(255, 68, 68, 0.3);
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #ff4444 0%, #00ff7f 50%, #00d9ff 75%, #ff8b13 100%);
      border-radius: 2px;
      transition: width 0.3s ease;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, transparent, rgba(255, 68, 68, 0.4), transparent);
        animation: securityShimmer 2s infinite;
      }
    }
  }
  
  @keyframes securityShimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const StatusBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 68, 68, 0.1);
  border: 1px solid rgba(255, 68, 68, 0.4);
  border-radius: 20px;
  font-size: 12px;
  color: #ff4444;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-top: 16px;
  position: relative;
  
  &::before {
    content: '🔐 ';
    font-size: 14px;
  }
  
  .indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ff4444;
    animation: securityGlow 2s ease-in-out infinite alternate;
  }
  
  @keyframes securityGlow {
    0% { 
      box-shadow: 0 0 5px #ff4444;
      background: #ff4444;
    }
    100% { 
      box-shadow: 0 0 15px #ff4444, 0 0 25px #ff4444;
      background: #00ff7f;
    }
  }
`;

export default function SkeletonLoader() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing secure systems...');
  const [currentPhase, setCurrentPhase] = useState(0);

  const phases = [
    { status: 'Initializing secure systems...', phase: 0 },
    { status: 'Establishing encrypted connections...', phase: 1 },
    { status: 'Configuring cloud infrastructure...', phase: 2 },
    { status: 'Optimizing gaming performance...', phase: 3 },
    { status: 'Finalizing Linux environment...', phase: 4 },
    { status: 'Security protocols active - System ready!', phase: 5 }
  ];

  const skills = [
    {
      icon: '🤖',
      title: 'Android Developer',
      description: 'Building custom ROMs, kernels, and recoveries for Android devices',
      accentColor: '#3ddc84',
      secondaryColor: '#69f0ae',
      status: 'BUILDING'
    },
    {
      icon: '☁️',
      title: 'Cloud & Docker',
      description: 'Learning AWS basics, Docker containerization, and cloud fundamentals',
      accentColor: '#4dabf7',
      secondaryColor: '#74c0fc',
      status: 'LEARNING'
    },
    {
      icon: '🐧',
      title: 'Linux Enthusiast',
      description: 'Passionate about Linux systems, terminal usage, and open source',
      accentColor: '#51cf66',
      secondaryColor: '#8ce99a',
      status: 'ACTIVE'
    },
    {
      icon: '🎮',
      title: 'Casual Gaming',
      description: 'Gaming for fun, system optimization, and hardware tinkering',
      accentColor: '#ff8b13',
      secondaryColor: '#ffa94d',
      status: 'READY'
    }
  ];

  useEffect(() => {
    const startTime = Date.now();
    const duration = 4500; // 4.5 seconds
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(Math.round(progressPercent));
      
      // Update phase based on progress
      const phaseIndex = Math.min(Math.floor((progressPercent / 100) * phases.length), phases.length - 1);
      setCurrentPhase(phaseIndex);
      setStatus(phases[phaseIndex].status);
      
      if (progressPercent < 100) {
        requestAnimationFrame(updateProgress);
      }
    };
    
    requestAnimationFrame(updateProgress);
  }, []);

  // Generate floating code snippets
  const codeSnippets = [
    'sudo apt update', 'docker run -d', 'kubectl apply', 'vim ~/.bashrc',
    'git push origin', 'npm install', 'systemctl status', 'chmod +x',
    'grep -r "pattern"', 'curl -X POST', 'ps aux | grep', 'tail -f /var/log',
    'ssh user@server', 'find / -name', 'awk \'{print $1}\'', 'sed -i \'s/old/new/g\'',
    'netstat -tulpn', 'lsof -i :8080', 'mount /dev/sda1', 'crontab -e'
  ];

  return (
    <SkeletonContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Geometric Background */}
      <GeometricBackground>
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="hex"
            style={{
              left: `${10 + (index * 12)}%`,
              top: `${20 + Math.sin(index) * 40}%`,
              animationDelay: `${index * -1.5}s`
            }}
          />
        ))}
      </GeometricBackground>

      {/* Data Streams */}
      <DataStreams>
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="stream"
            style={{
              left: `${15 + (index * 15)}%`,
              animationDelay: `${index * -2}s`
            }}
          />
        ))}
      </DataStreams>

      <LoaderContent>
        <Brand
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="title">AMRUT'S PORTFOLIO</div>
          <div className="subtitle">Developer • Linux Enthusiast • Android Developer • Casual Gamer</div>
        </Brand>

        <SkillsGrid
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          {skills.map((skill, index) => (
            <SkillCard
              key={index}
              accentColor={skill.accentColor}
              secondaryColor={skill.secondaryColor}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
            >
              <span className="icon">{skill.icon}</span>
              <div className="title">{skill.title}</div>
              <div className="description">{skill.description}</div>
              <div className="status">
                <div className="dot"></div>
                {skill.status}
              </div>
            </SkillCard>
          ))}
        </SkillsGrid>

        <ProgressContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="progress-info">
            <span className="status">{status}</span>
            <span className="percentage">{progress}%</span>
          </div>
          <div className="progress-track">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </ProgressContainer>

        <StatusBadge
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <div className="indicator"></div>
          SECURE CONNECTION ACTIVE
        </StatusBadge>
      </LoaderContent>
    </SkeletonContainer>
  );
}