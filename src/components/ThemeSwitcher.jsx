import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { themes } from '../themes/themes';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ThemeButton = styled(motion.button)`
  background: ${({ theme }) => theme.colors.glass};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 15px ${({ theme }) => `${theme.colors.primary}20`};
  
  .icon {
    font-size: 1rem;
  }

  .label {
    position: relative;
    font-size: 0.8rem;
    
    &::before {
      content: '';
      position: absolute;
      left: -8px;
      top: 50%;
      width: 4px;
      height: 4px;
      background: ${({ theme }) => theme.colors.primary};
      border-radius: 50%;
      transform: translateY(-50%);
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      ${({ theme }) => `${theme.colors.primary}10`},
      transparent,
      ${({ theme }) => `${theme.colors.primary}10`}
    );
    opacity: 0;
    transition: 0.3s;
  }

  &:hover::before {
    opacity: 1;
  }

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    background: ${({ theme }) => theme.colors.primary};
    bottom: 0;
    left: 0;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: scaleX(1);
    transform-origin: left;
  }

  .status {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.5);
      opacity: 0.5;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const ThemeMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(20px);
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 12px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 180px;
  overflow: hidden;
  box-shadow: 0 0 20px ${({ theme }) => `${theme.colors.primary}30`};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      ${({ theme }) => theme.colors.primary},
      transparent
    );
  }
`;

const ThemeOption = styled(motion.button)`
  padding: 0.8rem 1rem;
  border: none;
  border-radius: 8px;
  background: ${({ isActive, theme }) => 
    isActive ? `${theme.colors.primary}20` : 'transparent'};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  transition: all 0.3s ease;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  letter-spacing: 0.5px;

  .icon {
    font-size: 1rem;
    width: 20px;
    text-align: center;
  }

  &:hover {
    background: ${({ theme }) => `${theme.colors.primary}30`};
    padding-left: 1.2rem;
  }

  ${({ isActive, theme }) => isActive && `
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: ${theme.colors.primary};
      border-radius: 0 4px 4px 0;
    }
  `}
`;

const ThemeLabel = styled.span`
  flex: 1;
`;

const ThemeShortcut = styled.span`
  opacity: 0.5;
  font-size: 0.8rem;
`;

export default function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme, setCurrentTheme } = useTheme();
  const themeMenuRef = useRef(null);
  const themeButtonRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        themeMenuRef.current && 
        !themeMenuRef.current.contains(event.target) &&
        !themeButtonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const themeIcons = {
    dark: "moon",
    black: "circle",
    light: "sun",
    neon: "bolt",
    cyberpunk: "microchip",
    matrix: "terminal",
    synthwave: "wave-square"
  };

  return (
    <ThemeToggle>
      <motion.div 
        whileHover={{ scale: 1.02 }} 
        whileTap={{ scale: 0.98 }}
        ref={themeButtonRef}
      >
        <ThemeButton
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Theme Configuration"
        >
          <i className={`fas fa-${themeIcons[currentTheme]} icon`} />
          <span className="label">THEME.CONFIG</span>
          <span className="status" />
        </ThemeButton>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <ThemeMenu
            ref={themeMenuRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              style={{ 
                padding: "4px 8px", 
                opacity: 0.7, 
                fontSize: "0.8rem",
                fontFamily: "'JetBrains Mono', monospace",
                borderBottom: `1px solid ${themes[currentTheme].colors.primary}30`,
                marginBottom: "4px"
              }}
            >
              SELECT_THEME
            </motion.div>
            {Object.keys(themes).map((themeKey) => (
              <motion.div
                key={themeKey}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <ThemeOption
                  isActive={currentTheme === themeKey}
                  onClick={() => {
                    setCurrentTheme(themeKey);
                    setIsOpen(false);
                  }}
                >
                  <i className={`fas fa-${themeIcons[themeKey]} icon`} />
                  <ThemeLabel>{themes[themeKey].name}</ThemeLabel>
                  <ThemeShortcut>⌘{Object.keys(themes).indexOf(themeKey) + 1}</ThemeShortcut>
                </ThemeOption>
              </motion.div>
            ))}
          </ThemeMenu>
        )}
      </AnimatePresence>
    </ThemeToggle>
  );
}
