import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const ControlContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StatusTrayButton = styled(motion.button)`
  background: ${({ theme }) => `${theme.colors.primary}08`};
  border: 1px solid ${({ theme }) => `${theme.colors.border}40`};
  border-radius: 12px;
  padding: 6px 12px;
  margin-left: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;
  outline: none;

  &:hover {
    background: ${({ theme }) => `${theme.colors.primary}15`};
    border-color: ${({ theme }) => theme.colors.primary}80;
    box-shadow: 0 4px 12px ${({ theme }) => `${theme.colors.primary}15`};
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

const TrayIcon = styled.span`
  color: ${props => props.$active ? props.$color : ({ theme }) => theme.colors.textSecondary};
  opacity: ${props => props.$active ? 1 : 0.4};
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
`;

const DropdownPanel = styled(motion.div)`
  position: absolute;
  top: calc(100% + 10px);
  left: 10px;
  background: ${({ theme }) => theme.colors.background}f2;
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid ${({ theme }) => theme.colors.primary}50;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 290px;
  box-shadow: 
    0 10px 30px -10px rgba(0, 0, 0, 0.8),
    0 0 2px 1px ${({ theme }) => theme.colors.primary}30 inset;
  z-index: 101;
  font-family: 'IBM Plex Mono', 'Fira Code', 'Space Mono', monospace;

  will-change: transform, opacity;
  transform: translateZ(0);

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
  }
`;

const PanelHeader = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  border-bottom: 1px solid ${({ theme }) => `${theme.colors.primary}30`};
  padding-bottom: 8px;
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  letter-spacing: 1px;
`;

const PanelSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid ${({ theme }) => `${theme.colors.primary}15`};
`;

const SectionTitle = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DeviceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
`;

const DeviceLabel = styled.span`
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
  
  i {
    width: 14px;
    text-align: center;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const DeviceInfo = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.75rem;
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 36px;
  height: 18px;
  background: ${props => props.$active ? props.theme.colors.primary : 'rgba(255,255,255,0.1)'};
  border-radius: 9px;
  cursor: pointer;
  transition: background 0.2s ease;
  
  .thumb {
    position: absolute;
    top: 2px;
    left: ${props => props.$active ? '20px' : '2px'};
    width: 14px;
    height: 14px;
    background: ${props => props.$active ? props.theme.colors.background : props.theme.colors.text};
    border-radius: 50%;
    transition: left 0.2s ease, background 0.2s ease;
  }
`;

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

const SliderHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SliderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  
  i {
    width: 16px;
    text-align: center;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 0.85rem;
  }
`;

const CustomRangeInput = styled.input`
  flex: 1;
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: ${({ theme }) => theme.colors.text}15;
  outline: none;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.text}10;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
    box-shadow: 0 0 6px ${({ theme }) => `${theme.colors.primary}60`};
    transition: transform 0.1s ease;
    
    &:hover {
      transform: scale(1.25);
    }
  }
`;

export default function SystemControl() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isBluetoothOn, setIsBluetoothOn] = useState(true);
  
  // Simulated hardware controls
  const [volume, setVolume] = useState(70);
  const [brightness, setBrightness] = useState(100);

  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  // Apply screen brightness dynamically using global filter
  useEffect(() => {
    // Apply brightness filter. We cap the minimum brightness at 40% so the user doesn't get a completely black screen.
    const actualBrightness = Math.max(40, brightness);
    document.body.style.filter = `brightness(${actualBrightness}%)`;
    
    return () => {
      document.body.style.filter = 'none';
    };
  }, [brightness]);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle clicking outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Determine volume icon based on percentage
  const getVolumeIcon = () => {
    if (volume === 0) return 'volume-mute';
    if (volume < 35) return 'volume-off';
    if (volume < 70) return 'volume-down';
    return 'volume-up';
  };

  return (
    <ControlContainer>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        ref={buttonRef}
      >
        <StatusTrayButton
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Quick System Controls"
        >
          <TrayIcon 
            $active={isOnline} 
            $color={isOnline ? '#00ff41' : '#ff4141'}
          >
            <i className={`fas fa-${isOnline ? 'wifi' : 'wifi-slash'}`} />
          </TrayIcon>

          <TrayIcon 
            $active={isBluetoothOn} 
            $color={isBluetoothOn ? '#00c6ff' : 'currentColor'}
          >
            <i className="fab fa-bluetooth-b" />
          </TrayIcon>
        </StatusTrayButton>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <DropdownPanel
            ref={containerRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <PanelHeader>
              <span>SYS_CONTROLS.SH</span>
              <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>OS: PortfolioLinux</span>
            </PanelHeader>

            {/* Network Section */}
            <PanelSection>
              <SectionTitle>
                <span>WiFi Network</span>
                <span style={{ color: isOnline ? '#00ff41' : '#ff4141', fontSize: '0.65rem' }}>
                  {isOnline ? 'ONLINE' : 'OFFLINE'}
                </span>
              </SectionTitle>
              
              <DeviceRow>
                <DeviceLabel>
                  <i className={`fas fa-${isOnline ? 'wifi' : 'wifi-slash'}`} />
                  {isOnline ? 'Amrut_WiFi_5G' : 'Disconnected'}
                </DeviceLabel>
                <DeviceInfo>{isOnline ? '192.168.1.42' : 'N/A'}</DeviceInfo>
              </DeviceRow>
            </PanelSection>

            {/* Bluetooth Section */}
            <PanelSection>
              <SectionTitle>
                <span>Bluetooth</span>
                <ToggleSwitch 
                  $active={isBluetoothOn} 
                  onClick={() => setIsBluetoothOn(!isBluetoothOn)}
                >
                  <div className="thumb" />
                </ToggleSwitch>
              </SectionTitle>

              <DeviceRow style={{ opacity: isBluetoothOn ? 1 : 0.4 }}>
                <DeviceLabel>
                  <i className="fab fa-bluetooth-b" style={{ color: isBluetoothOn ? '#00c6ff' : 'inherit' }} />
                  Sony WH-1000XM4
                </DeviceLabel>
                <DeviceInfo>{isBluetoothOn ? 'Connected' : 'Disabled'}</DeviceInfo>
              </DeviceRow>

              {isBluetoothOn && (
                <DeviceRow>
                  <DeviceLabel>
                    <i className="fas fa-keyboard" style={{ color: '#00c6ff' }} />
                    Keychron K2
                  </DeviceLabel>
                  <DeviceInfo>Connected</DeviceInfo>
                </DeviceRow>
              )}
            </PanelSection>

            {/* Audio Volume Slider */}
            <PanelSection>
              <SliderContainer>
                <SliderHeader>
                  <span>Volume</span>
                  <span>{volume}%</span>
                </SliderHeader>
                <SliderRow>
                  <i className={`fas fa-${getVolumeIcon()}`} />
                  <CustomRangeInput 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={volume}
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                  />
                </SliderRow>
              </SliderContainer>
            </PanelSection>

            {/* Brightness Slider */}
            <PanelSection style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <SliderContainer>
                <SliderHeader>
                  <span>Brightness</span>
                  <span>{brightness}%</span>
                </SliderHeader>
                <SliderRow>
                  <i className="fas fa-sun" />
                  <CustomRangeInput 
                    type="range" 
                    min="40" 
                    max="100" 
                    value={brightness}
                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                  />
                </SliderRow>
              </SliderContainer>
            </PanelSection>

          </DropdownPanel>
        )}
      </AnimatePresence>
    </ControlContainer>
  );
}
