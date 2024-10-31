import { useState, useEffect, useRef } from 'react';
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
  background: ${({ theme, $isMenuOpen }) => 
    $isMenuOpen 
      ? `${theme.colors.glass}F0`
      : `${theme.colors.glass}`
  };
  -webkit-backdrop-filter: ${({ $isMenuOpen }) => 
    $isMenuOpen 
      ? 'blur(20px)'
      : 'blur(10px)'
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

  @media (min-width: 768px) {
    padding: 0 50px;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background: ${({ theme }) => `${theme.colors.glass}F0`};
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 99;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  will-change: backdrop-filter;
  
  /* Force hardware acceleration for Safari */
  -webkit-transform: translate3d(0,0,0);
  transform: translate3d(0,0,0);
  
  /* Additional Safari support */
  @supports (-webkit-backdrop-filter: none) {
    -webkit-backdrop-filter: blur(20px);
  }
  
  @media (min-width: 768px) {
    display: none;
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

  @media (min-width: 768px) {
    display: none;
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

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const NavLink = styled.a`
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

  @media (max-width: 767px) {
    .desktop-nav {
      display: none;
    }
  }
`;

const navItems = [
  { name: 'About', link: '#about', number: '01' },
  { name: 'Certifications', link: '#certifications', number: '02' }
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

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

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <NavLinks>
              <NavLink href="#about" number="01">About</NavLink>
              <NavLink href="#certifications" number="02">Certifications</NavLink>
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
