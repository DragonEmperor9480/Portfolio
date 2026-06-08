import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const ClockContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const ClockButton = styled(motion.button)`
  background: ${({ theme }) => `${theme.colors.primary}10`};
  border: 1px solid ${({ theme }) => `${theme.colors.border}80`};
  color: ${({ theme }) => theme.colors.text};
  padding: 6px 14px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'IBM Plex Mono', 'Fira Code', 'Space Mono', monospace;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s ease;
  user-select: none;
  
  .icon {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.primary};
  }

  .time-text {
    letter-spacing: 0.5px;
  }

  &:hover {
    background: ${({ theme }) => `${theme.colors.primary}15`};
    border-color: ${({ theme }) => theme.colors.primary}80;
    box-shadow: 0 4px 12px ${({ theme }) => `${theme.colors.primary}20`};
  }

  @media (max-width: 1200px) {
    padding: 6px 10px;
    
    .icon {
      display: none;
    }
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 0.8rem;
    
    .icon {
      display: none;
    }
  }

  @media (max-width: 480px) {
    padding: 6px 8px;
    
    .icon {
      display: none;
    }
  }
`;

const StatusMenu = styled(motion.div)`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: ${({ theme }) => theme.colors.background}f2;
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid ${({ theme }) => theme.colors.primary}50;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 280px;
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

const MenuHeader = styled.div`
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

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
  gap: 12px;
`;

const StatusLabel = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 8px;
  
  i {
    width: 14px;
    text-align: center;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const StatusValue = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const PulseDot = styled(motion.span)`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.$color || '#00ff41'};
  display: inline-block;
`;

const BarContainer = styled.div`
  width: 80px;
  height: 6px;
  background: ${({ theme }) => theme.colors.text}15;
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  border: 1px solid ${({ theme }) => theme.colors.text}20;
`;

const BarFill = styled(motion.div)`
  height: 100%;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 3px;
`;

const FormatToggleButton = styled(motion.button)`
  background: ${({ theme }) => `${theme.colors.primary}10`};
  border: 1px solid ${({ theme }) => `${theme.colors.border}80`};
  color: ${({ theme }) => theme.colors.text};
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  width: 100%;
  text-align: center;
  transition: all 0.2s ease;
  margin-top: 6px;

  &:hover {
    background: ${({ theme }) => `${theme.colors.primary}20`};
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 4px 12px ${({ theme }) => `${theme.colors.primary}15`};
  }
`;

export default function SystemClock() {
  const [time, setTime] = useState(new Date());
  const [is24h, setIs24h] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // System metrics
  const [cpuLoad, setCpuLoad] = useState(2.4);
  const [memPercent, setMemPercent] = useState(48);
  const [ping, setPing] = useState(24);

  const startTimeRef = useRef(Date.now());
  const [uptime, setUptime] = useState(0);

  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Time & Uptime Tick
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      
      // Update uptime
      setUptime(Math.floor((Date.now() - startTimeRef.current) / 1000));

      // Fluctuating system metrics to feel dynamic & alive
      setCpuLoad((prev) => {
        const delta = (Math.random() - 0.5) * 0.8;
        const next = prev + delta;
        return Math.max(1.0, Math.min(15.0, parseFloat(next.toFixed(1))));
      });

      setMemPercent((prev) => {
        const delta = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        const next = prev + delta;
        return Math.max(45, Math.min(52, next));
      });

      if (Math.random() > 0.8) {
        setPing((prev) => {
          const delta = Math.floor((Math.random() - 0.5) * 6);
          const next = prev + delta;
          return Math.max(12, Math.min(45, next));
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
        menuRef.current && 
        !menuRef.current.contains(event.target) &&
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

  // Format Helper functions
  const formatTimeText = (date) => {
    if (is24h) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    } else {
      let hours = date.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const hoursStr = hours.toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      return `${hoursStr}:${minutes}:${seconds} ${ampm}`;
    }
  };

  const formatNavbarTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    if (is24h) {
      return `${hours}:${minutes}`;
    } else {
      let h = date.getHours();
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      h = h ? h : 12;
      const hoursStr = h.toString().padStart(2, '0');
      return `${hoursStr}:${minutes} ${ampm}`;
    }
  };

  const formatDateText = (date) => {
    const weekday = date.toLocaleDateString(undefined, { weekday: 'short' });
    const month = date.toLocaleDateString(undefined, { month: 'short' });
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${weekday} ${month} ${day}, ${year}`;
  };

  const formatUptimeText = (totalSecs) => {
    const hours = Math.floor(totalSecs / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSecs % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSecs % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatTimezone = () => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const offset = new Date().getTimezoneOffset();
      const absOffset = Math.abs(offset);
      const hours = Math.floor(absOffset / 60).toString().padStart(2, '0');
      const mins = (absOffset % 60).toString().padStart(2, '0');
      const sign = offset <= 0 ? '+' : '-';
      
      // Get short abbreviation like IST, EST, UTC
      const parts = new Intl.DateTimeFormat(undefined, { timeZoneName: 'short' }).formatToParts(new Date());
      const shortName = parts.find(p => p.type === 'timeZoneName')?.value || 'UTC';
      
      return `${shortName} (UTC${sign}${hours}:${mins})`;
    } catch (e) {
      return 'UTC';
    }
  };

  return (
    <ClockContainer>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        ref={buttonRef}
      >
        <ClockButton 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="System Clock and Stats"
        >
          <i className="fas fa-clock icon" />
          <span className="time-text">{formatNavbarTime(time)}</span>
        </ClockButton>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <StatusMenu
            ref={menuRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <MenuHeader>
              <span>SYSTEM_MONITOR.SH</span>
              <PulseDot 
                $color={isOnline ? '#00ff41' : '#ff4141'}
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              />
            </MenuHeader>

            <StatusRow>
              <StatusLabel>
                <i className="fas fa-calendar-day" />
                Date
              </StatusLabel>
              <StatusValue>{formatDateText(time)}</StatusValue>
            </StatusRow>

            <StatusRow>
              <StatusLabel>
                <i className="fas fa-globe" />
                Zone
              </StatusLabel>
              <StatusValue style={{ fontSize: '0.75rem' }}>{formatTimezone()}</StatusValue>
            </StatusRow>

            <StatusRow>
              <StatusLabel>
                <i className="fas fa-hourglass-half" />
                Uptime
              </StatusLabel>
              <StatusValue>{formatUptimeText(uptime)}</StatusValue>
            </StatusRow>

            <StatusRow>
              <StatusLabel>
                <i className="fas fa-microchip" />
                CPU Load
              </StatusLabel>
              <StatusValue>
                <span>{cpuLoad}%</span>
                <BarContainer>
                  <BarFill 
                    animate={{ width: `${(cpuLoad / 15) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </BarContainer>
              </StatusValue>
            </StatusRow>

            <StatusRow>
              <StatusLabel>
                <i className="fas fa-memory" />
                Memory
              </StatusLabel>
              <StatusValue>
                <span>{memPercent}%</span>
                <BarContainer>
                  <BarFill 
                    animate={{ width: `${memPercent}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </BarContainer>
              </StatusValue>
            </StatusRow>

            <StatusRow>
              <StatusLabel>
                <i className="fas fa-signal" />
                Ping
              </StatusLabel>
              <StatusValue>
                <span>{ping} ms</span>
              </StatusValue>
            </StatusRow>

            <FormatToggleButton
              onClick={() => setIs24h(!is24h)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              FORMAT: {is24h ? '24-HOUR' : '12-HOUR'}
            </FormatToggleButton>
          </StatusMenu>
        )}
      </AnimatePresence>
    </ClockContainer>
  );
}
