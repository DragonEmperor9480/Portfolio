'use client';

import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useLenis } from 'lenis/react';
import ThemeSwitcher from './ThemeSwitcher';
import SystemClock from './SystemClock';
import SystemControl from './SystemControl';
import useWindowDimensions from '../hooks/useWindowDimensions';
import FullscreenModal from './FullscreenModal';
import NavMusicPlayer from './NavMusicPlayer';
import AppLauncher from './apps/AppLauncher';
import { useApps } from '../context/AppsContext';

const NavContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 24px;
  z-index: 100;
  pointer-events: none;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Nav = styled(motion.nav)`
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  background: ${({ theme }) => theme.colors.background}e6;
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid ${({ theme }) => theme.colors.primary}50;
  border-radius: 20px;
  box-shadow: 
    0 10px 30px -10px rgba(0, 0, 0, 0.8),
    0 0 2px 1px ${({ theme }) => theme.colors.primary}30 inset;
  padding: 0 20px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary}50;
  }
`;

const NavRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    height: 56px;
  }
`;

const LogoLink = styled.a`
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  letter-spacing: -0.04em;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 2;
  
  .dot {
    width: 6px;
    height: 6px;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    box-shadow: 0 0 10px ${({ theme }) => theme.colors.primary};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const CenterLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  position: absolute;
  left: 46%;
  transform: translateX(-50%);
  z-index: 5;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const NavLink = styled(motion.a)`
  font-family: 'Oxanium', sans-serif;
  font-weight: 600;
  color: ${({ theme, $active }) => $active ? theme.colors.text : theme.colors.textSecondary};
  text-decoration: none;
  font-size: 0.9rem;
  padding: 6px 16px;
  border-radius: 12px;
  position: relative;
  transition: color 0.2s ease;
  z-index: 1;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
  
  @media (max-width: 1024px) {
    font-size: 1.05rem;
    padding: 12px 16px;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
  }
`;

const ActivePill = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.colors.text}10;
  border-radius: 12px;
  z-index: -1;
`;

const ActiveUnderline = styled(motion.div)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 2px;
  height: 2px;
  background: ${({ theme }) => theme.colors.primary};
  z-index: 1;
`;

const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 1200px) {
    gap: 8px;
  }

  @media (max-width: 1024px) {
    .desktop-only {
      display: none;
    }
  }
`;

const ActionButton = styled(motion.button)`
  background: ${({ theme, $primary }) => $primary ? theme.colors.text : 'transparent'};
  color: ${({ theme, $primary }) => $primary ? theme.colors.background : theme.colors.text};
  border: 1px solid ${({ theme, $primary }) => $primary ? 'transparent' : `${theme.colors.primary}40`};
  padding: 6px 16px;
  border-radius: 12px;
  font-family: 'Oxanium', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  text-decoration: none;

  &:hover {
    background: ${({ theme, $primary }) => $primary ? theme.colors.text : theme.colors.text}15;
    transform: translateY(-1px);
  }

  @media (max-width: 1024px) {
    width: 100%;
    justify-content: center;
    padding: 12px;
    font-size: 0.95rem;
  }
`;

const MenuButton = styled(motion.button)`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  z-index: 101;
  transition: background 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.text}10;
  }

  @media (min-width: 1025px) {
    display: none;
  }
`;

const MobileDropdown = styled(motion.div)`
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  @media (min-width: 1025px) {
    display: none;
  }
`;

const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 0 24px;
  border-top: 1px solid ${({ theme }) => `${theme.colors.primary}20`};
`;

const DesktopControlsLeft = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const DesktopOnlyFlex = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const MobileDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => `${theme.colors.primary}20`};
  width: 100%;
  margin: 8px 0;
`;

const MobileControlsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  width: 100%;
  margin: 8px 0;
  box-sizing: border-box;

  /* Force wrapper divs to stretch to full width of columns */
  & > div,
  & > div > div,
  & > div > div > div {
    width: 100% !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
  }

  button {
    margin: 0 !important;
    width: 100% !important;
    height: 44px !important;
    justify-content: center !important;
    font-size: 0.85rem !important;
    border-radius: 12px !important;
    padding: 0 12px !important;
    box-sizing: border-box !important;
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
  }

  /* Force text labels and icons to show inside mobile controls */
  .label {
    display: inline !important;
  }

  .icon {
    display: inline-block !important;
  }

  .time-text {
    font-size: 0.85rem !important;
  }
`;

const MobileMusicRow = styled.div`
  width: 100%;
  margin-bottom: 8px;
  display: flex;
  justify-content: center;

  & > div, & > div > button {
    width: 100% !important;
    margin: 0 !important;
  }
  
  button {
    height: 44px !important;
    justify-content: center !important;
    border-radius: 12px !important;
    width: 100% !important;
  }
`;

const navItems = [
  { id: 'home', name: 'Home' },
  { id: 'about', name: 'About' },
  { id: 'achievements', name: 'Achievements' },
  { id: 'certifications', name: 'Certifications' },
  // TODO: Implement and enable the Lab tab/modal later
  // { id: 'lab', name: 'Lab' }
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLabModal, setShowLabModal] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  
  const { width } = useWindowDimensions();
  const navRef = useRef(null);
  const buttonRef = useRef(null);
  const lenis = useLenis();
  const { closeLauncher } = useApps();
  const handleNavClick = (e, id) => {
    e.preventDefault();
    closeLauncher(); // close app selection overlay
    if (id === 'lab') {
      setShowLabModal(true);
      return;
    }
    if (lenis) {
      lenis.scrollTo(`#${id}`, { duration: 1.2 });
    } else {
      const target = document.getElementById(id);
      if (target) {
        const yOffset = -80; // height of the navbar
        const y = target.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };



  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.id);
      let current = 'home';
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.3 && rect.bottom >= window.innerHeight * 0.3) {
            current = section;
          }
        }
      }
      
      if (window.scrollY < 100) current = 'home';
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    setTimeout(handleScroll, 100);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const shouldCollapseMobileMenu = width > 1024;
  useEffect(() => {
    if (shouldCollapseMobileMenu && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [width, shouldCollapseMobileMenu, isMenuOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        navRef.current && 
        !navRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const closedHeight = width <= 768 ? '56px' : '60px';
  const navHeight = isMenuOpen ? 'auto' : closedHeight;

  return (
    <>
      <NavContainer>
        <Nav
          ref={navRef}
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ 
            overflow: (isMenuOpen || width > 1024) ? 'visible' : 'hidden',
            height: 'auto'
          }}
        >
          <NavRow>
            <div style={{ display: 'flex', alignItems: 'center', zIndex: 2 }}>
              <LogoLink href="#home" onClick={(e) => handleNavClick(e, 'home')}>
                <span className="dot" />
                AN
              </LogoLink>

              <DesktopControlsLeft>
                <AppLauncher />
                <SystemControl />
              </DesktopControlsLeft>
            </div>

            <CenterLinks>
              {navItems.map((item, idx) => {
                const isActive = activeSection === item.id;
                const isHovered = hoveredIndex === idx;
                
                return (
                  <NavLink
                    key={item.id}
                    href={`#${item.id}`}
                    $active={isActive}
                    onClick={(e) => handleNavClick(e, item.id)}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <AnimatePresence>
                      {isHovered && (
                        <ActivePill
                          layoutId="nav-hover-pill"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                    </AnimatePresence>
                    {isActive && (
                      <ActiveUnderline
                        layoutId="nav-active-pill"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    {item.name}
                  </NavLink>
                );
              })}
            </CenterLinks>

            <RightControls>
              <DesktopOnlyFlex>
                <ActionButton 
                  as="a"
                  $primary
                  href="https://drive.google.com/file/d/1WUu8oNh8mLDHmN2Zovze9BHVIUmzldGW/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fas fa-file-pdf" style={{ fontSize: '0.85rem' }} /> Resume
                </ActionButton>
              </DesktopOnlyFlex>

              <div className="desktop-only">
                <NavMusicPlayer />
              </div>
              
              <div className="desktop-only">
                <SystemClock />
              </div>
              <div className="desktop-only">
                <ThemeSwitcher />
              </div>
              
              <MenuButton
                ref={buttonRef}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ rotate: isMenuOpen ? 90 : 0 }}
              >
                <i className={`fas fa-${isMenuOpen ? 'times' : 'bars'}`} />
              </MenuButton>
            </RightControls>
          </NavRow>

          <AnimatePresence>
            {isMenuOpen && (
              <MobileDropdown
                initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                animate={{ 
                  opacity: 1, 
                  height: 'auto',
                  transitionEnd: { overflow: 'visible' }
                }}
                exit={{ 
                  opacity: 0, 
                  height: 0, 
                  overflow: 'hidden' 
                }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <MobileContainer>
                  {navItems.map((item) => (
                    <NavLink
                      key={item.id}
                      href={`#${item.id}`}
                      $active={activeSection === item.id}
                      onClick={(e) => {
                        handleNavClick(e, item.id);
                        setTimeout(() => {
                          setIsMenuOpen(false);
                        }, 100);
                      }}
                    >
                      {item.name}
                    </NavLink>
                  ))}
                  
                  <MobileDivider />

                  <MobileControlsGrid>
                    <AppLauncher />
                    <SystemControl />
                    <ThemeSwitcher />
                    <SystemClock />
                  </MobileControlsGrid>

                  <MobileMusicRow>
                    <NavMusicPlayer />
                  </MobileMusicRow>

                  <ActionButton 
                    as="a"
                    $primary
                    href="https://drive.google.com/file/d/1WUu8oNh8mLDHmN2Zovze9BHVIUmzldGW/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fas fa-file-pdf" style={{ fontSize: '0.85rem' }} /> Resume
                  </ActionButton>
                </MobileContainer>
              </MobileDropdown>
            )}
          </AnimatePresence>
        </Nav>
      </NavContainer>

      <FullscreenModal
        isOpen={showLabModal}
        onClose={() => setShowLabModal(false)}
      />
    </>
  );
}
