import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const ClockContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const ClockButton = styled(motion.button)`
  background: ${({ theme }) => `${theme?.colors?.primary || '#64ffda'}10`};
  border: 1px solid ${({ theme }) => `${theme?.colors?.border || 'rgba(100,255,218,0.1)'}a0`};
  color: ${({ theme }) => theme?.colors?.text || '#E6E6E6'};
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  
  .icon {
    font-size: 0.9rem;
    color: ${({ theme }) => theme?.colors?.primary || '#64ffda'};
    filter: drop-shadow(0 0 4px ${({ theme }) => theme?.colors?.primary || '#64ffda'});
  }

  .time-text {
    letter-spacing: 0.5px;
  }

  &:hover {
    background: ${({ theme }) => `${theme?.colors?.primary || '#64ffda'}20`};
    border-color: ${({ theme }) => theme?.colors?.primary || '#64ffda'};
    box-shadow: 
      0 4px 15px ${({ theme }) => `${theme?.colors?.primary || '#64ffda'}25`},
      0 0 2px ${({ theme }) => theme?.colors?.primary || '#64ffda'} inset;
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
  }

  @media (max-width: 480px) {
    padding: 6px 8px;
  }
`;

const StatusMenu = styled(motion.div)`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: #0d0d10e6;
  backdrop-filter: blur(28px) saturate(200%);
  -webkit-backdrop-filter: blur(28px) saturate(200%);
  border: 1.5px solid ${({ theme }) => theme?.colors?.primary || '#64ffda'};
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 320px;
  box-shadow: 
    0 15px 40px -10px rgba(0, 0, 0, 0.9),
    0 0 2px 1px rgba(255, 255, 255, 0.05) inset;
  z-index: 101;
  font-family: 'IBM Plex Mono', 'Fira Code', 'Space Mono', monospace;

  /* CRT Screen Overlay */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      rgba(18, 16, 16, 0) 50%, 
      rgba(0, 0, 0, 0.12) 50%
    );
    background-size: 100% 4px;
    pointer-events: none;
    z-index: 10;
    opacity: 0.5;
  }

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
  }
`;

const MenuHeader = styled.div`
  font-size: 0.72rem;
  font-weight: 800;
  color: ${({ theme }) => theme?.colors?.primary || '#64ffda'};
  border-bottom: 1.5px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 8px;
  margin-bottom: 2px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  letter-spacing: 1.5px;
  text-shadow: 0 0 5px ${({ theme }) => `${theme?.colors?.primary || '#64ffda'}40`};
`;

const NeofetchWrapper = styled.div`
  display: flex;
  gap: 16px;
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  padding: 10px 12px;
  align-items: flex-start;
  box-shadow: inset 0 0 8px rgba(0,0,0,0.8);
`;

const AsciiArt = styled.pre`
  color: ${({ theme }) => theme?.colors?.primary || '#64ffda'};
  font-size: 0.62rem;
  line-height: 1.15;
  margin: 0;
  font-weight: 900;
  text-shadow: 0 0 4px ${({ theme }) => `${theme?.colors?.primary || '#64ffda'}50`};
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 0.65rem;
  color: ${({ theme }) => theme?.colors?.textSecondary || '#B3B3B3'};
  flex: 1;

  .user-host {
    font-weight: 700;
    color: #ffffff;
    border-bottom: 1px dashed rgba(255, 255, 255, 0.15);
    padding-bottom: 2px;
    margin-bottom: 2px;
    
    .host {
      color: ${({ theme }) => theme?.colors?.primary || '#64ffda'};
    }
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
  }

  .stat-lbl {
    color: rgba(255, 255, 255, 0.4);
  }

  .stat-val {
    color: #ffffff;
    font-weight: 500;
  }
`;

const PulseDot = styled(motion.span)`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.$color || '#00ff41'};
  display: inline-block;
  box-shadow: 0 0 6px ${props => props.$color || '#00ff41'};
`;

const MetricSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 8px;
`;

const MetricRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MetricLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.65rem;
  color: ${({ theme }) => theme?.colors?.textSecondary || '#B3B3B3'};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  .val {
    font-family: monospace;
    color: #ffffff;
  }
`;

const SegmentedBar = styled.div`
  font-family: monospace;
  font-size: 0.72rem;
  color: ${({ theme }) => theme?.colors?.primary || '#64ffda'};
  letter-spacing: 1px;
  text-shadow: 0 0 3px ${({ theme }) => `${theme?.colors?.primary || '#64ffda'}40`};
`;

const LogTerminal = styled.div`
  background: #040406;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 8px;
  font-family: 'Fira Code', 'Space Mono', monospace;
  font-size: 0.6rem;
  color: #00ff41;
  height: 96px;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  gap: 3px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.95);
  position: relative;
  
  .log-line {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-shadow: 0 0 2px rgba(0, 255, 65, 0.55);
  }
`;

const FormatToggleButton = styled(motion.button)`
  background: linear-gradient(180deg, #2a2a2e 0%, #17171a 100%);
  border: 1px solid #3f3f46;
  border-bottom: 3px solid #000000;
  color: #ffffff;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.72rem;
  font-weight: 700;
  width: 100%;
  text-align: center;
  transition: all 0.1s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.5);

  &:hover {
    color: ${({ theme }) => theme?.colors?.primary || '#64ffda'};
    border-color: #52525b;
  }

  &:active {
    border-bottom-width: 1px;
    transform: translateY(2px);
    box-shadow: 0 1px 2px rgba(0,0,0,0.5);
  }
`;

const LOG_POOL = [
  "[  OK  ] Mounted /dev/sda1 to /boot",
  "[ INFO ] CPU core thermal stability verified",
  "[  OK  ] Service 'portfolio-daemon' active",
  "[ INFO ] HTRP connection speed stable at 54ms",
  "[ WARN ] Thread count throttle warning (transient)",
  "[  OK  ] Cleared page cache buffers",
  "[ INFO ] Synchronizing system clock with pool.ntp.org",
  "[  OK  ] Query complete: Cloudflare Edge Cache",
  "[ INFO ] Memory audit: 0x7FFF8000 heap clean",
  "[  OK  ] Theme switch synced to local settings",
  "[ INFO ] Garbage collector run: reclaimed 14.2MB",
  "[  OK  ] Loaded modules: react-core.so, lenis-scroll.so",
  "[ INFO ] Active ports listening: 80, 443, 3000",
  "[  OK  ] Handshake verified with API endpoint"
];

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

  // scrolling system logs
  const [logs, setLogs] = useState([
    "[  OK  ] Boot sequence complete. Kernel v1.0.0",
    "[ INFO ] Initializing portfolio visual display...",
    "[  OK  ] GPU rendering initialised",
    "[ INFO ] WebAudio engine online",
    "[  OK  ] System clock initialised"
  ]);

  // Time, Uptime & Metrics Tick
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

  // Diagnostics logs simulation effect
  useEffect(() => {
    const logTimer = setInterval(() => {
      if (isOpen) {
        const randomLine = LOG_POOL[Math.floor(Math.random() * LOG_POOL.length)];
        setLogs((prev) => {
          const updated = [...prev, randomLine];
          if (updated.length > 6) {
            updated.shift(); // keep it constrained to 6 logs
          }
          return updated;
        });
      }
    }, 2500);

    return () => clearInterval(logTimer);
  }, [isOpen]);

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
      const parts = new Intl.DateTimeFormat(undefined, { timeZoneName: 'short' }).formatToParts(new Date());
      return parts.find(p => p.type === 'timeZoneName')?.value || 'UTC';
    } catch {
      return 'UTC';
    }
  };

  const renderSegmentedBar = (percentage, totalBlocks = 12) => {
    const activeBlocks = Math.round((percentage / 100) * totalBlocks);
    const active = '█'.repeat(activeBlocks);
    const inactive = '░'.repeat(totalBlocks - activeBlocks);
    return `[${active}${inactive}]`;
  };

  // Isometric cube ASCII logo
  const asciiCube = `  _____
 /\\    \\
/  \\____\\
\\  /    /
 \\/____/`;

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
              <span>SYS_MONITOR.SH</span>
              <PulseDot 
                $color={isOnline ? '#00ff41' : '#ff4141'}
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              />
            </MenuHeader>

            {/* Neofetch widget panel */}
            <NeofetchWrapper>
              <AsciiArt>{asciiCube}</AsciiArt>
              <InfoList>
                <div className="user-host">shura@<span className="host">portfolio_os</span></div>
                <div className="stat-row">
                  <span className="stat-lbl">DATE</span>
                  <span className="stat-val">{formatDateText(time)}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-lbl">TZ</span>
                  <span className="stat-val">{formatTimezone()}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-lbl">UP</span>
                  <span className="stat-val">{formatUptimeText(uptime)}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-lbl">PING</span>
                  <span className="stat-val">{ping}ms</span>
                </div>
              </InfoList>
            </NeofetchWrapper>

            {/* Hardware resource meters */}
            <MetricSection>
              <MetricRow>
                <MetricLabel>
                  <span>CPU Load</span>
                  <span className="val">{cpuLoad}%</span>
                </MetricLabel>
                <SegmentedBar>{renderSegmentedBar((cpuLoad / 15) * 100)}</SegmentedBar>
              </MetricRow>
              <MetricRow>
                <MetricLabel>
                  <span>Memory</span>
                  <span className="val">{memPercent}%</span>
                </MetricLabel>
                <SegmentedBar>{renderSegmentedBar(memPercent)}</SegmentedBar>
              </MetricRow>
            </MetricSection>

            {/* Simulated Live Syslog Diagnostic Feed */}
            <LogTerminal>
              {logs.map((logLine, idx) => (
                <div key={idx} className="log-line">
                  {logLine}
                </div>
              ))}
            </LogTerminal>

            <FormatToggleButton
              onClick={() => setIs24h(!is24h)}
              whileTap={{ scale: 0.98 }}
            >
              SWITCH_FORMAT: {is24h ? '24-HOUR' : '12-HOUR'}
            </FormatToggleButton>
          </StatusMenu>
        )}
      </AnimatePresence>
    </ClockContainer>
  );
}
