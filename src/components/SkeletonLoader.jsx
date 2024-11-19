import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const SkeletonContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  font-family: 'JetBrains Mono', monospace;
`;

const Terminal = styled(motion.div)`
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(10px);
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.primary};
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
`;

const TerminalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
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
    color: ${({ theme }) => theme.colors.primary};
  }

  .command-text {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: ${({ theme }) => `${theme.colors.primary}20`};
  border-radius: 2px;
  margin: 15px 0;
  overflow: hidden;
  position: relative;
`;

const Progress = styled(motion.div)`
  height: 100%;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 2px;
  box-shadow: 0 0 10px ${({ theme }) => theme.colors.primary};
`;

const Status = styled(motion.div)`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.8;
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
`;

export default function SkeletonLoader() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing system...');

  useEffect(() => {
    const steps = [
      { progress: 30, status: 'Loading dependencies...' },
      { progress: 50, status: 'Configuring environment...' },
      { progress: 75, status: 'Starting services...' },
      { progress: 90, status: 'Optimizing...' },
      { progress: 100, status: 'Launch sequence complete' }
    ];

    steps.forEach(({ progress, status }, index) => {
      setTimeout(() => {
        setProgress(progress);
        setStatus(status);
      }, (index + 1) * 350);
    });
  }, []);

  return (
    <SkeletonContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Terminal>
        <TerminalHeader>
          <Circle color="#ff5f56" />
          <Circle color="#ffbd2e" />
          <Circle color="#27c93f" />
        </TerminalHeader>
        <Command>
          <span className="prompt">[SYSTEM]</span>
          <span className="command-text">Initializing portfolio v1.0.2</span>
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
            className="command-text"
            animate={{ opacity: [0.5, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            {progress === 100 ? 'Ready to explore...' : 'Processing...'}
          </motion.span>
        </Command>
      </Terminal>
    </SkeletonContainer>
  );
} 