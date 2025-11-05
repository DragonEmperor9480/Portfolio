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

  @media (max-width: 1024px) {
    padding: 0 30px;
  }

  @media (max-width: 768px) {
    padding: 0 20px;
    height: 70px;
  }

  @media (max-width: 480px) {
    padding: 0 15px;
    height: 65px;
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
    width: 100%;
  }
`;

const NavLink = styled(motion.a)`
  font-family: 'Inter', 'Segoe UI', sans-serif;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  padding: 12px 20px;
  position: relative;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  border-radius: 8px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 8px;
    left: 50%;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
    transition: all 0.3s ease;
    transform: translateX(-50%);
    border-radius: 2px;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => `${theme.colors.primary}08`};
    
    &::after {
      width: 60%;
    }
  }

  @media (max-width: 767px) {
    padding: 16px 20px;
    font-size: 1.05rem;
    border-radius: 12px;
    
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
  border-radius: 25px;
  padding: 10px 20px;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: -0.01em;
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
    transform: translateY(-2px);
    
    &::before {
      left: 0;
    }
  }

  @media (max-width: 767px) {
    margin: 16px 0 0 0;
    padding: 14px 20px;
    font-size: 0.95rem;
    justify-content: center;
    border-radius: 12px;
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
  border-radius: 0 0 20px 20px;
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
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  font-weight: 800;
  letter-spacing: -0.02em;
  padding: 8px 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &::before {
    content: '<';
    color: ${({ theme }) => theme.colors.secondary};
    margin-right: 4px;
    font-weight: 600;
  }
  
  &::after {
    content: '/>';
    color: ${({ theme }) => theme.colors.secondary};
    margin-left: 4px;
    font-weight: 600;
  }
  
  &:hover {
    transform: scale(1.05);
    text-shadow: 0 0 10px ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => `${theme.colors.primary}08`};
  }
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    padding: 6px 10px;
  }

  @media (max-width: 480px) {
    font-size: 1.3rem;
    padding: 4px 8px;
  }
`;

const SystemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Fira Code', 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.9;
  
  @media (max-width: 1024px) {
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
  color: ${({ theme }) => theme.colors.text};
  
  &::before {
    content: 'system@portfolio:~$ ';
    color: ${({ theme }) => theme.colors.primary};
    opacity: 0.9;
    font-weight: 500;
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

  @media (max-width: 1024px) {
    gap: 1rem;
    
    .desktop-nav {
      display: none;
    }
  }

  @media (max-width: 768px) {
    gap: 0.5rem;
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
  border-radius: 12px;
  width: 40px;
  height: 40px;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => `${theme.colors.primary}15`};
    box-shadow: 0 0 10px ${({ theme }) => `${theme.colors.primary}30`};
    transform: rotate(90deg);
  }

  @media (min-width: 1025px) {
    display: none;
  }

  @media (max-width: 480px) {
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
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

  const shouldShowMobileMenu = width <= 1024;

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
              href="https://drive.google.com/file/d/1WUu8oNh8mLDHmN2Zovze9BHVIUmzldGW/view?usp=sharing"
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
