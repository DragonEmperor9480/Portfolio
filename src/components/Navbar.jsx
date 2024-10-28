import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import ThemeSwitcher from './ThemeSwitcher';

const Nav = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  padding: 0 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  z-index: 100;

  .right-section {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
`;

const LogoSection = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const LogoButton = styled(Link)`
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    opacity: 0.8;
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  color: #64ffda;
  opacity: 0.8;

  &:before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #64ffda;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.5; }
    100% { transform: scale(1); opacity: 1; }
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 3rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(motion.a)`
  font-family: 'JetBrains Mono', monospace;
  color: #ccd6f6;
  text-decoration: none;
  font-size: 15px;
  padding: 8px 12px;
  border-radius: 8px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:before {
    content: '${props => props.number}';
    color: #64ffda;
    font-size: 14px;
    opacity: 0.8;
  }

  &:hover {
    background: rgba(100, 255, 218, 0.1);
    color: #64ffda;
    transform: translateY(-2px);
  }
`;

const ResumeButton = styled(motion.a)`
  color: #64ffda;
  background: transparent;
  border: 1px solid #64ffda;
  border-radius: 8px;
  padding: 12px 24px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 150%;
    height: 150%;
    background: rgba(100, 255, 218, 0.15);
    transform: translate(-50%, -50%) rotate(45deg);
    transition: transform 0.6s ease;
    z-index: -1;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(100, 255, 218, 0.2);
  }

  &:hover:before {
    transform: translate(-50%, -50%) rotate(225deg);
  }
`;

const TechStack = styled(motion.div)`
  position: absolute;
  top: 80px;
  left: 50px;
  background: rgba(17, 34, 64, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(100, 255, 218, 0.2);
  border-radius: 8px;
  padding: 15px;
  display: flex;
  gap: 10px;
  box-shadow: 0 10px 30px -10px rgba(2,12,27,0.7);
`;

const TechIcon = styled(motion.span)`
  font-size: 20px;
  color: #64ffda;
  opacity: 0.8;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 1;
    transform: translateY(-2px);
  }
`;

export default function Navbar() {
  const [showTech, setShowTech] = useState(false);

  return (
    <Nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <LogoSection>
        <LogoButton to="/">
          <span>AN_</span>
        </LogoButton>
        <StatusIndicator>ready</StatusIndicator>
      </LogoSection>

      <NavLinks>
        <NavLink 
          href="#about" 
          number="01"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          About
        </NavLink>
        <NavLink 
          href="#experience" 
          number="02"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Experience
        </NavLink>
        <NavLink 
          href="#work" 
          number="03"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Work
        </NavLink>
        <NavLink 
          href="#contact" 
          number="04"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Contact
        </NavLink>
        <ResumeButton 
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>📄</span> Resume.pdf
        </ResumeButton>
      </NavLinks>

      <div className="right-section">
        <ThemeSwitcher />
      </div>

      <AnimatePresence>
        {showTech && (
          <TechStack
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <TechIcon title="React">⚛️</TechIcon>
            <TechIcon title="Node.js">🟢</TechIcon>
            <TechIcon title="TypeScript">📘</TechIcon>
            <TechIcon title="Python">🐍</TechIcon>
            <TechIcon title="AWS">☁️</TechIcon>
          </TechStack>
        )}
      </AnimatePresence>
    </Nav>
  );
}
