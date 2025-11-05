import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ShaderAnimation } from './ui/shader-lines';

const SkeletonContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  font-family: 'JetBrains Mono', monospace;
  overflow: hidden;
`;

const Terminal = styled(motion.div)`
  background: rgba(13, 17, 23, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  padding: 20px;
  border: 1px solid #30363d;
  color: #00ff41;
  box-shadow: 0 8px 32px 0 rgba(0, 255, 65, 0.1);
  position: relative;
  z-index: 10;
`;

const TerminalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #30363d;
`;

const Circle = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const Command = styled.div`
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  opacity: 0.9;

  .prompt {
    color: #00ff41;
    font-weight: 600;
  }

  .command-text {
    color: #c9d1d9;
  }

  .success {
    color: #00ff41;
  }

  .warning {
    color: #ffbd2e;
  }

  .info {
    color: #64ffda;
  }
`;

const SystemStatus = styled.div`
  margin: 15px 0;
  padding: 12px;
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 6px;
  font-size: 12px;
  
  .status-line {
    display: flex;
    justify-content: space-between;
    margin: 4px 0;
    color: #8b949e;
    
    .status-value {
      color: #00ff41;
    }
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #21262d;
  border-radius: 2px;
  margin: 15px 0;
  overflow: hidden;
  position: relative;
`;

const Progress = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #00ff41, #00cc33);
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
`;

const Status = styled(motion.div)`
  font-size: 12px;
  color: #8b949e;
  opacity: 0.8;
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
`;

export default function SkeletonLoader() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing system...');
  const [systemInfo, setSystemInfo] = useState({
    cpu: 0,
    memory: 0,
    uptime: 0
  });

  useEffect(() => {
    const steps = [
      { progress: 20, status: 'Booting kernel modules...' },
      { progress: 40, status: 'Loading React framework...' },
      { progress: 60, status: 'Configuring environment...' },
      { progress: 80, status: 'Starting services...' },
      { progress: 95, status: 'Optimizing performance...' },
      { progress: 100, status: 'System ready - launching interface' }
    ];

    // System info updates
    const systemTimer = setInterval(() => {
      setSystemInfo(prev => ({
        cpu: Math.min(prev.cpu + Math.random() * 10, 85),
        memory: Math.min(prev.memory + Math.random() * 8, 65),
        uptime: prev.uptime + 1
      }));
    }, 100);

    steps.forEach(({ progress, status }, index) => {
      setTimeout(() => {
        setProgress(progress);
        setStatus(status);
      }, (index + 1) * 400);
    });

    return () => clearInterval(systemTimer);
  }, []);

  return (
    <SkeletonContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Shader Animation Background */}
      <ShaderAnimation />
      
      <Terminal>
        <TerminalHeader>
          <Circle color="#ff5f56" />
          <Circle color="#ffbd2e" />
          <Circle color="#27c93f" />
        </TerminalHeader>
        
        <Command>
          <span className="prompt">[SYSTEM]</span>
          <span className="command-text">Portfolio OS v3.0.0 - Terminal Interface</span>
        </Command>
        
        <Command>
          <span className="prompt">[INFO]</span>
          <span className="command-text info">Node.js v18.17.0 | React v18.3.1 | Vite v7.0.2</span>
        </Command>

        <SystemStatus>
          <div className="status-line">
            <span>CPU Usage:</span>
            <span className="status-value">{systemInfo.cpu.toFixed(1)}%</span>
          </div>
          <div className="status-line">
            <span>Memory:</span>
            <span className="status-value">{systemInfo.memory.toFixed(1)}%</span>
          </div>
          <div className="status-line">
            <span>Uptime:</span>
            <span className="status-value">{systemInfo.uptime}s</span>
          </div>
          <div className="status-line">
            <span>Status:</span>
            <span className="status-value">ONLINE</span>
          </div>
        </SystemStatus>

        <Command>
          <span className="prompt">[BOOT]</span>
          <span className="command-text">Executing startup sequence...</span>
        </Command>
        
        <ProgressBar>
          <Progress
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </ProgressBar>
        <Status>
          <motion.span>{status}</motion.span>
          <motion.span>{progress}%</motion.span>
        </Status>
        
        <Command>
          <span className="prompt">[LOG]</span>
          <motion.span
            className={`command-text ${progress === 100 ? 'success' : 'info'}`}
            animate={{ opacity: [0.5, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            {progress === 100 ? 'Ready to explore portfolio...' : 'Processing deployment...'}
          </motion.span>
        </Command>
      </Terminal>
    </SkeletonContainer>
  );
}