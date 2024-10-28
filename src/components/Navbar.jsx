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
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => `${theme.colors.glass}`};
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  z-index: 100;
  padding: 0 50px;
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
  color: ${({ theme }) => theme.colors.primary};
  opacity: 0.8;
  padding: 4px 8px;
  border-radius: 4px;
  background: ${({ theme }) => `${theme.colors.primary}10`};

  &:before {
    content: '';
    width: 8px;
    height: 8px;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    animation: pulse 2s infinite;
    box-shadow: 0 0 10px ${({ theme }) => theme.colors.primary};
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled(motion.a)`
  font-family: 'JetBrains Mono', monospace;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-size: 15px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:before {
    content: '${props => props.number}';
    color: ${({ theme }) => theme.colors.primary};
    font-size: 14px;
    opacity: 0.8;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
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

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
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

      <RightSection>
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
          <ResumeButton href="/resume.pdf">
            Resume
          </ResumeButton>
        </NavLinks>
        <ThemeSwitcher />
      </RightSection>

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
