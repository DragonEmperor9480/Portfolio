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
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme, $isMenuOpen }) => 
    $isMenuOpen 
      ? `${theme.colors.glass}F0`
      : `${theme.colors.glass}`
  };
  backdrop-filter: ${({ $isMenuOpen }) => 
    $isMenuOpen 
      ? 'blur(20px)'
      : 'blur(10px)'
  };
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  z-index: 100;
  padding: 0 20px;
  transition: all 0.3s ease;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  will-change: backdrop-filter;

  @media (max-width: 768px) {
    background: ${({ theme }) => theme.colors.background};
    backdrop-filter: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  @media (min-width: 768px) {
    padding: 0 50px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
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
  padding: 12px 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;

  &:before {
    content: '${props => props.number}';
    color: ${({ theme }) => theme.colors.primary};
    font-size: 0.9rem;
    opacity: 0.8;
  }

  @media (max-width: 767px) {
    padding: 14px 16px;
    font-size: 1rem;
    
    &:hover {
      background: ${({ theme }) => `${theme.colors.primary}10`};
      transform: translateX(4px);
    }
  }

  @media (min-width: 768px) {
    &:hover {
      color: ${({ theme }) => theme.colors.primary};
      transform: translateY(-2px);
    }
  }
`;

const ResumeButton = styled(motion.a)`
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => `${theme.colors.primary}10`};
  border: 1px solid ${({ theme }) => `${theme.colors.primary}30`};
  border-radius: 12px;
  padding: 12px 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => `${theme.colors.primary}15`};
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 5px 15px ${({ theme }) => `${theme.colors.primary}20`};
  }

  @media (max-width: 767px) {
    margin-top: 8px;
    padding: 14px 16px;
    font-size: 1rem;
    justify-content: center;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 90px;
  left: 20px;
  right: 20px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.background};
  backdrop-filter: blur(20px);
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 99;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);

  /* Custom scrollbar styles */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => `${theme.colors.primary}10`};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => `${theme.colors.primary}30`};
    border-radius: 4px;
    
    &:hover {
      background: ${({ theme }) => `${theme.colors.primary}50`};
    }
  }

  @media (max-height: 600px) {
    top: 80px;
    max-height: calc(100vh - 100px);
  }
`;

const LogoSection = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const LogoButton = styled.a`
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  
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
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 5px;
  z-index: 101;

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
          <span>AN_</span>
        </LogoButton>
        <StatusIndicator>ready</StatusIndicator>
      </LogoSection>

      <RightSection>
        <div className="desktop-nav">
          <NavLinks className="desktop-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                href={item.link}
                number={item.number}
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
                  number={item.number}
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
