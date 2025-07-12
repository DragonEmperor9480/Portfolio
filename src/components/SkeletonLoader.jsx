import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import anime from 'animejs';

const SkeletonContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  font-family: 'JetBrains Mono', monospace;
  overflow: hidden;
`;

const SpaceBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(ellipse at 20% 30%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(255, 119, 198, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at center, #0a0a23 0%, #000000 70%);
  overflow: hidden;
`;

const AnimationContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
`;

const Terminal = styled(motion.div)`
  background: rgba(13, 17, 23, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  padding: 20px;
  border: 1px solid #30363d;
  color: #00ff41;
  box-shadow: 0 8px 32px 0 rgba(0, 255, 65, 0.1);
  position: relative;
  z-index: 10;
`;

const TerminalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #30363d;
`;

const Circle = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const Command = styled.div`
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  opacity: 0.9;

  .prompt {
    color: #00ff41;
    font-weight: 600;
  }

  .command-text {
    color: #c9d1d9;
  }

  .success {
    color: #00ff41;
  }

  .warning {
    color: #ffbd2e;
  }

  .info {
    color: #64ffda;
  }
`;

const SystemStatus = styled.div`
  margin: 15px 0;
  padding: 12px;
  background: rgba(22, 27, 34, 0.8);
  border: 1px solid #30363d;
  border-radius: 6px;
  font-size: 12px;
  
  .status-line {
    display: flex;
    justify-content: space-between;
    margin: 4px 0;
    color: #8b949e;
    
    .status-value {
      color: #00ff41;
    }
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #21262d;
  border-radius: 2px;
  margin: 15px 0;
  overflow: hidden;
  position: relative;
`;

const Progress = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #00ff41, #00cc33);
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
`;

const Status = styled(motion.div)`
  font-size: 12px;
  color: #8b949e;
  opacity: 0.8;
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
`;

// Enhanced Space Elements with fascinating cosmic phenomena
const SpaceElements = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Create twinkling stars with cross sparkles
    const createTwinklingStars = () => {
      const fragment = document.createDocumentFragment();
      const starsArray = [];
      
      for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        const size = Math.random() * 3 + 1;
        const brightness = Math.random() * 0.8 + 0.2;
        
        star.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: white;
          border-radius: 50%;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          opacity: ${brightness};
          box-shadow: 0 0 ${size * 2}px rgba(255, 255, 255, 0.8);
        `;
        
        // Add cross sparkle effect for larger stars
        if (size > 2) {
          star.style.boxShadow += `, 0 0 ${size * 4}px rgba(255, 255, 255, 0.3)`;
          
          const sparkle1 = document.createElement('div');
          sparkle1.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 1px;
            height: ${size * 8}px;
            background: linear-gradient(to bottom, transparent, white, transparent);
            opacity: 0.6;
          `;
          
          const sparkle2 = document.createElement('div');
          sparkle2.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(90deg);
            width: 1px;
            height: ${size * 6}px;
            background: linear-gradient(to bottom, transparent, white, transparent);
            opacity: 0.6;
          `;
          
          star.appendChild(sparkle1);
          star.appendChild(sparkle2);
        }
        
        fragment.appendChild(star);
        starsArray.push(star);
      }
      
      container.appendChild(fragment);
      return starsArray;
    };

    // Create mysterious wormholes
    const createWormholes = () => {
      const fragment = document.createDocumentFragment();
      const wormholesArray = [];
      
      for (let i = 0; i < 2; i++) {
        const wormhole = document.createElement('div');
        const size = 60 + Math.random() * 40;
        
        wormhole.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
        `;
        
        // Create spiral effect with multiple rings
        for (let j = 0; j < 5; j++) {
          const ring = document.createElement('div');
          const ringSize = size - (j * 8);
          ring.style.cssText = `
            position: absolute;
            width: ${ringSize}px;
            height: ${ringSize}px;
            border: 2px solid rgba(147, 51, 234, ${0.8 - j * 0.1});
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: wormholeRing${i}-${j} ${3 + j}s linear infinite;
            box-shadow: 
              0 0 20px rgba(147, 51, 234, 0.5),
              inset 0 0 20px rgba(147, 51, 234, 0.3);
          `;
          
          const style = document.createElement('style');
          style.textContent = `
            @keyframes wormholeRing${i}-${j} {
              0% { transform: translate(-50%, -50%) rotate(0deg) scale(1); opacity: 0.8; }
              50% { transform: translate(-50%, -50%) rotate(180deg) scale(0.8); opacity: 0.4; }
              100% { transform: translate(-50%, -50%) rotate(360deg) scale(1); opacity: 0.8; }
            }
          `;
          document.head.appendChild(style);
          
          wormhole.appendChild(ring);
        }
        
        // Central void
        const void_ = document.createElement('div');
        void_.style.cssText = `
          position: absolute;
          width: 20px;
          height: 20px;
          background: radial-gradient(circle, #000000, transparent);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 30px #000000;
        `;
        wormhole.appendChild(void_);
        
        fragment.appendChild(wormhole);
        wormholesArray.push(wormhole);
      }
      
      container.appendChild(fragment);
      return wormholesArray;
    };

    // Create binary star systems
    const createBinaryStars = () => {
      const fragment = document.createDocumentFragment();
      const binaryStarsArray = [];
      
      for (let i = 0; i < 2; i++) {
        const binarySystem = document.createElement('div');
        binarySystem.style.cssText = `
          position: absolute;
          width: 80px;
          height: 80px;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
        `;
        
        // Create two orbiting stars
        for (let j = 0; j < 2; j++) {
          const star = document.createElement('div');
          const color = j === 0 ? '#ffff00' : '#ff6347';
          star.style.cssText = `
            position: absolute;
            width: 12px;
            height: 12px;
            background: radial-gradient(circle, ${color}, ${color}aa);
            border-radius: 50%;
            box-shadow: 0 0 20px ${color};
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: binaryOrbit${i}-${j} 4s linear infinite;
          `;
          
          const style = document.createElement('style');
          style.textContent = `
            @keyframes binaryOrbit${i}-${j} {
              0% { 
                transform: translate(-50%, -50%) rotate(${j * 180}deg) translateX(25px) rotate(${-j * 180}deg); 
              }
              100% { 
                transform: translate(-50%, -50%) rotate(${j * 180 + 360}deg) translateX(25px) rotate(${-j * 180 - 360}deg); 
              }
            }
          `;
          document.head.appendChild(style);
          
          binarySystem.appendChild(star);
        }
        
        fragment.appendChild(binarySystem);
        binaryStarsArray.push(binarySystem);
      }
      
      container.appendChild(fragment);
      return binaryStarsArray;
    };

    // Create floating space debris
    const createSpaceDebris = () => {
      const fragment = document.createDocumentFragment();
      const debrisArray = [];
      
      for (let i = 0; i < 12; i++) {
        const debris = document.createElement('div');
        const size = Math.random() * 3 + 1;
        const colors = ['#696969', '#778899', '#2f4f4f', '#708090'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        debris.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          opacity: 0.6;
          transform: rotate(${Math.random() * 360}deg);
        `;
        
        fragment.appendChild(debris);
        debrisArray.push(debris);
      }
      
      container.appendChild(fragment);
      return debrisArray;
    };

    // Create cosmic particles
    const createCosmicParticles = () => {
      const fragment = document.createDocumentFragment();
      const particlesArray = [];
      const colors = [
        '#64ffda', '#00ff41', '#ffffff', '#ff6b6b', 
        '#ffd93d', '#6c5ce7', '#a29bfe', '#fd79a8'
      ];
      
      for (let i = 0; i < 25; i++) {
        const particle = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 4 + 2;
        
        particle.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          border-radius: 50%;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          box-shadow: 0 0 ${size * 3}px ${color};
          opacity: 0.7;
        `;
        fragment.appendChild(particle);
        particlesArray.push(particle);
      }
      
      container.appendChild(fragment);
      return particlesArray;
    };

    // Create nebula clouds
    const createNebulaClouds = () => {
      const fragment = document.createDocumentFragment();
      const nebulasArray = [];
      const nebulaColors = [
        'rgba(100, 255, 218, 0.12)',
        'rgba(255, 107, 107, 0.1)',
        'rgba(108, 92, 231, 0.12)',
        'rgba(253, 121, 168, 0.1)',
        'rgba(255, 215, 0, 0.08)'
      ];
      
      for (let i = 0; i < 4; i++) {
        const nebula = document.createElement('div');
        const size = Math.random() * 350 + 200;
        const color = nebulaColors[i];
        
        nebula.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: radial-gradient(circle, ${color} 0%, transparent 70%);
          filter: blur(30px);
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          opacity: 0.8;
        `;
        fragment.appendChild(nebula);
        nebulasArray.push(nebula);
      }
      
      container.appendChild(fragment);
      return nebulasArray;
    };

    // Create all elements
    const stars = createTwinklingStars();
    const wormholes = createWormholes();
    const binaryStars = createBinaryStars();
    const spaceDebris = createSpaceDebris();
    const particles = createCosmicParticles();
    const nebulas = createNebulaClouds();

    // Enhanced Anime.js animations
    
    // Twinkling stars
    anime({
      targets: stars,
      opacity: [0.3, 1, 0.3],
      scale: [1, 1.2, 1],
      duration: 2000,
      delay: anime.stagger(100),
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine'
    });

    // Wormholes distorting space-time
    anime({
      targets: wormholes,
      scale: [0.8, 1.2, 0.8],
      opacity: [0.6, 1, 0.6],
      duration: 6000,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine'
    });

    // Space debris floating
    anime({
      targets: spaceDebris,
      translateX: anime.stagger([-50, 50]),
      translateY: anime.stagger([-30, 30]),
      rotate: [0, 360],
      duration: 15000,
      loop: true,
      easing: 'linear'
    });

    // Cosmic particles floating
    anime({
      targets: particles,
      translateY: anime.stagger([-40, 40], { direction: 'reverse' }),
      translateX: anime.stagger([-30, 30]),
      rotate: [0, 360],
      scale: [0.8, 1.3, 0.8],
      opacity: [0.3, 1, 0.5],
      duration: 8000,
      delay: anime.stagger(400),
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutQuad'
    });

    // Nebula clouds breathing
    anime({
      targets: nebulas,
      scale: [0.9, 1.2, 0.9],
      rotate: [0, 45, 0],
      opacity: [0.4, 0.8, 0.4],
      duration: 12000,
      delay: anime.stagger(2000),
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine'
    });

    // Cleanup
    return () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);

  return <AnimationContainer ref={containerRef} />;
};

export default function SkeletonLoader() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing system...');
  const [systemInfo, setSystemInfo] = useState({
    cpu: 0,
    memory: 0,
    uptime: 0
  });

  useEffect(() => {
    const steps = [
      { progress: 20, status: 'Booting kernel modules...' },
      { progress: 40, status: 'Loading React framework...' },
      { progress: 60, status: 'Configuring environment...' },
      { progress: 80, status: 'Starting services...' },
      { progress: 95, status: 'Optimizing performance...' },
      { progress: 100, status: 'System ready - launching interface' }
    ];

    // System info updates
    const systemTimer = setInterval(() => {
      setSystemInfo(prev => ({
        cpu: Math.min(prev.cpu + Math.random() * 10, 85),
        memory: Math.min(prev.memory + Math.random() * 8, 65),
        uptime: prev.uptime + 1
      }));
    }, 100);

    steps.forEach(({ progress, status }, index) => {
      setTimeout(() => {
        setProgress(progress);
        setStatus(status);
      }, (index + 1) * 400);
    });

    return () => clearInterval(systemTimer);
  }, []);

  return (
    <SkeletonContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <SpaceBackground>
        <SpaceElements />
      </SpaceBackground>
      
      <Terminal>
        <TerminalHeader>
          <Circle color="#ff5f56" />
          <Circle color="#ffbd2e" />
          <Circle color="#27c93f" />
        </TerminalHeader>
        
        <Command>
          <span className="prompt">[SYSTEM]</span>
          <span className="command-text">Portfolio OS v2.1.0 - Terminal Interface</span>
        </Command>
        
        <Command>
          <span className="prompt">[INFO]</span>
          <span className="command-text info">Node.js v18.17.0 | React v18.3.1 | Vite v7.0.2</span>
        </Command>

        <SystemStatus>
          <div className="status-line">
            <span>CPU Usage:</span>
            <span className="status-value">{systemInfo.cpu.toFixed(1)}%</span>
          </div>
          <div className="status-line">
            <span>Memory:</span>
            <span className="status-value">{systemInfo.memory.toFixed(1)}%</span>
          </div>
          <div className="status-line">
            <span>Uptime:</span>
            <span className="status-value">{systemInfo.uptime}s</span>
          </div>
          <div className="status-line">
            <span>Status:</span>
            <span className="status-value">ONLINE</span>
          </div>
        </SystemStatus>

        <Command>
          <span className="prompt">[BOOT]</span>
          <span className="command-text">Executing startup sequence...</span>
        </Command>
        
        <ProgressBar>
          <Progress
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </ProgressBar>
        <Status>
          <motion.span>{status}</motion.span>
          <motion.span>{progress}%</motion.span>
        </Status>
        
        <Command>
          <span className="prompt">[LOG]</span>
          <motion.span
            className={`command-text ${progress === 100 ? 'success' : 'info'}`}
            animate={{ opacity: [0.5, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            {progress === 100 ? 'Ready to explore portfolio...' : 'Processing deployment...'}
          </motion.span>
        </Command>
      </Terminal>
    </SkeletonContainer>
  );
}