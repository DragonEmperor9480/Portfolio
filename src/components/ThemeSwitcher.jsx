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
  background: ${({ theme }) => `${theme.colors.primary}10`};
  border: 1px solid ${({ theme }) => `${theme.colors.primary}30`};
  color: ${({ theme }) => theme.colors.primary};
  padding: 8px 16px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  .icon {
    font-size: 1.1rem;
  }

  .label {
    font-size: 0.85rem;
    letter-spacing: 0.5px;
  }

  &:hover {
    background: ${({ theme }) => `${theme.colors.primary}15`};
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 5px 15px ${({ theme }) => `${theme.colors.primary}20`};
  }

  @media (max-width: 768px) {
    padding: 14px 16px;
    font-size: 1rem;
    
    .icon {
      font-size: 1.2rem;
    }

    .label {
      display: none;
    }
  }

  @media (max-width: 480px) {
    padding: 12px;
    
    .icon {
      font-size: 1.1rem;
    }
  }
`;

const ThemeMenu = styled(motion.div)`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(20px);
  border: 1px solid ${({ theme }) => `${theme.colors.primary}30`};
  border-radius: 16px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 280px;
  box-shadow: 0 10px 30px -15px rgba(2, 12, 27, 0.7);
  z-index: 101;

  @media (max-width: 768px) {
    position: fixed;
    top: 90px;
    left: 20px;
    right: 20px;
    transform: none !important;
    width: auto;
    max-width: none;
    min-width: unset;
    background: ${({ theme }) => theme.colors.background};
    border: 1px solid ${({ theme }) => theme.colors.primary};
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    padding: 16px;
    gap: 8px;
  }
`;

const ThemeOption = styled(motion.button)`
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  background: ${({ isActive, theme }) => 
    isActive ? `${theme.colors.primary}15` : 'transparent'};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  @media (max-width: 768px) {
    padding: 14px 16px;
    font-size: 1rem;
    
    .icon {
      font-size: 1.2rem;
    }
  }

  ${({ isActive, theme }) => isActive && `
    background: ${theme.colors.primary}15;
    color: ${theme.colors.primary};
  `}
`;

const ThemeLabel = styled.span`
  flex: 1;
`;

const ThemeShortcut = styled.span`
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.5;
  font-size: 0.8rem;
  padding: 2px 6px;
  border-radius: 4px;
  background: ${({ theme }) => `${theme.colors.primary}10`};
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
    synthwave: "wave-square",
    retro: "gamepad",
    nord: "snowflake",
    mint: "leaf"
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
