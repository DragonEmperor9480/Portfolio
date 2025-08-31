import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import ThemeSwitcher from './ThemeSwitcher';
import useWindowDimensions from '../hooks/useWindowDimensions';

const Nav = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  z-index: 100;
  padding: 0 40px;
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      ${({ theme }) => theme.colors.primary} 20%, 
      ${({ theme }) => theme.colors.secondary} 50%, 
      ${({ theme }) => theme.colors.primary} 80%, 
      transparent 100%);
    opacity: 0.6;
  }

  @media (max-width: 768px) {
    padding: 0 20px;
    height: 70px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 0;
  align-items: center;

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
`;

const NavLink = styled(motion.a)`
  font-family: 'JetBrains Mono', monospace;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-size: 0.9rem;
  padding: 12px 20px;
  position: relative;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  border-radius: 0;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    
    &::after {
      width: 80%;
    }
  }

  @media (max-width: 767px) {
    padding: 16px 20px;
    font-size: 1rem;
    border-radius: 8px;
    
    &::after {
      display: none;
    }
    
    &:hover {
      background: ${({ theme }) => `${theme.colors.primary}15`};
      transform: translateX(4px);
    }
  }
`;

const ResumeButton = styled(motion.a)`
  color: ${({ theme }) => theme.colors.primary};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
  padding: 10px 20px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  margin-left: 20px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => `${theme.colors.primary}15`};
    transition: left 0.3s ease;
  }
  
  &:hover {
    color: ${({ theme }) => theme.colors.background};
    background: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 20px ${({ theme }) => `${theme.colors.primary}40`};
    
    &::before {
      left: 0;
    }
  }

  @media (max-width: 767px) {
    margin: 16px 0 0 0;
    padding: 14px 20px;
    font-size: 0.9rem;
    justify-content: center;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(20px);
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 99;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      ${({ theme }) => theme.colors.primary} 50%, 
      transparent 100%);
    opacity: 0.6;
  }
`;

const LogoSection = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const LogoButton = styled.a`
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  font-weight: 700;
  
  &::before {
    content: '<';
    color: ${({ theme }) => theme.colors.secondary};
    margin-right: 4px;
  }
  
  &::after {
    content: '/>';
    color: ${({ theme }) => theme.colors.secondary};
    margin-left: 4px;
  }
  
  &:hover {
    transform: scale(1.05);
    text-shadow: 0 0 10px ${({ theme }) => theme.colors.primary};
  }
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const SystemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.secondary};
  opacity: 0.7;
  
  @media (max-width: 968px) {
    display: none;
  }
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: pulse 2s infinite;
  box-shadow: 0 0 8px ${({ theme }) => theme.colors.primary};
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const SystemText = styled.span`
  &::before {
    content: 'system@portfolio:~$ ';
    color: ${({ theme }) => theme.colors.text};
    opacity: 0.6;
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

  @media (max-width: 1060px) {
    .desktop-nav {
      display: none;
    }
  }
`;

const MenuButton = styled(motion.button)`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  z-index: 101;
  border-radius: 4px;
  width: 40px;
  height: 40px;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => `${theme.colors.primary}15`};
    box-shadow: 0 0 10px ${({ theme }) => `${theme.colors.primary}30`};
  }

  @media (min-width: 1061px) {
    display: none;
  }
`;

const navItems = [
  { name: 'About', link: '#about', number: '01' },
  { name: 'Achievements', link: '#achievements', number: '02' },
  { name: 'Certifications', link: '#certifications', number: '03' }
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { width, height } = useWindowDimensions();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const shouldShowMobileMenu = width <= 1060 || height <= 883;

  useEffect(() => {
    if (!shouldShowMobileMenu && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [width, height, shouldShowMobileMenu]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <Nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      $isMenuOpen={isMenuOpen}
    >
      <LogoSection>
        <LogoButton href="#home">
          AN
        </LogoButton>
        <SystemInfo>
          <StatusDot />
          <SystemText>online</SystemText>
        </SystemInfo>
      </LogoSection>

      <RightSection>
        <div className="desktop-nav">
          <NavLinks className="desktop-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                href={item.link}
              >
                {item.name}
              </NavLink>
            ))}
            <ResumeButton
              href="https://drive.google.com/file/d/1HKUIG-yU87oTmuqeBZRiBfLPtwLZLGwn/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Resume.pdf
            </ResumeButton>
          </NavLinks>
        </div>
        <ThemeSwitcher />
        <MenuButton
          ref={buttonRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <i className={`fas fa-${isMenuOpen ? 'times' : 'bars'}`} />
        </MenuButton>
      </RightSection>

      <AnimatePresence>
        {isMenuOpen && (
          <MobileMenu
            ref={menuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <NavLinks>
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  href={item.link}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
              <ResumeButton
                href="https://drive.google.com/file/d/1LwmxptkPOEhyIEYJOoReFBfvzcMIUHkd/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Resume.pdf
              </ResumeButton>
            </NavLinks>
          </MobileMenu>
        )}
      </AnimatePresence>
    </Nav>
  );
}
