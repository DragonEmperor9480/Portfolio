import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  background: #0a0f12;
  overflow: hidden;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

class SystemBus {
  constructor(startPoint, endPoint) {
    this.start = startPoint;
    this.end = endPoint;
    this.signals = [];
    this.busWidth = 4; // Multiple lines in the bus
    this.spacing = 2; // Spacing between bus lines
  }

  sendSignal() {
    this.signals.push({
      position: 0,
      speed: 0.01,
      active: true,
      line: Math.floor(Math.random() * this.busWidth)
    });
  }

  draw(ctx, time) {
    // Draw multiple bus lines
    for (let i = 0; i < this.busWidth; i++) {
      const offset = (i - (this.busWidth - 1) / 2) * this.spacing;
      
      // Calculate perpendicular offset
      const dx = this.end.x - this.start.x;
      const dy = this.end.y - this.start.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const normalX = -dy / length;
      const normalY = dx / length;

      const startX = this.start.x + normalX * offset;
      const startY = this.start.y + normalY * offset;
      const endX = this.end.x + normalX * offset;
      const endY = this.end.y + normalY * offset;

      // Draw bus line
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = '#332200';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw signals on this line
      this.signals.forEach(signal => {
        if (signal.line === i) {
          const x = startX + (endX - startX) * signal.position;
          const y = startY + (endY - startY) * signal.position;

          const gradient = ctx.createLinearGradient(
            x - 10, y - 10,
            x + 10, y + 10
          );
          gradient.addColorStop(0, 'rgba(255, 200, 0, 0)');
          gradient.addColorStop(0.5, 'rgba(255, 200, 0, 0.8)');
          gradient.addColorStop(1, 'rgba(255, 200, 0, 0)');

          ctx.beginPath();
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 3;
          ctx.moveTo(x - 5, y - 5);
          ctx.lineTo(x + 5, y + 5);
          ctx.stroke();
        }
      });
    }

    // Update signals
    this.signals = this.signals.filter(signal => {
      signal.position += signal.speed;
      return signal.position <= 1;
    });
  }
}

class Module {
  constructor(x, y, type, width, height) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.width = width;
    this.height = height;
    this.active = false;
    this.pulseIntensity = 0;
  }

  draw(ctx, time) {
    // Module body
    ctx.fillStyle = this.active ? 
      'rgba(40, 44, 52, 0.9)' : 
      'rgba(30, 34, 42, 0.8)';
    ctx.strokeStyle = this.active ?
      'rgba(255, 200, 0, 0.5)' :
      'rgba(255, 200, 0, 0.2)';
    
    // Draw module with rounded corners
    ctx.beginPath();
    ctx.roundRect(
      this.x - this.width/2,
      this.y - this.height/2,
      this.width,
      this.height,
      5
    );
    ctx.fill();
    ctx.stroke();

    // Module label
    ctx.fillStyle = this.active ?
      'rgba(255, 200, 0, 0.9)' :
      'rgba(255, 200, 0, 0.4)';
    ctx.font = '14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.type, this.x, this.y);

    // Add pins/connectors
    this.drawPins(ctx);

    // Pulse effect when active
    if (this.active) {
      this.pulseIntensity = Math.min(1, this.pulseIntensity + 0.1);
    } else {
      this.pulseIntensity = Math.max(0, this.pulseIntensity - 0.05);
    }

    if (this.pulseIntensity > 0) {
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.width
      );
      gradient.addColorStop(0, `rgba(255, 200, 0, ${0.1 * this.pulseIntensity})`);
      gradient.addColorStop(1, 'rgba(255, 200, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }

  drawPins(ctx) {
    // Draw connection pins
    const pinLocations = [
      { x: -this.width/2, y: 0 },
      { x: this.width/2, y: 0 },
      { x: 0, y: -this.height/2 },
      { x: 0, y: this.height/2 }
    ];

    pinLocations.forEach(pin => {
      ctx.beginPath();
      ctx.arc(this.x + pin.x, this.y + pin.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = this.active ? '#ffcc00' : '#665500';
      ctx.fill();
    });
  }
}

class SoC extends Module {
  constructor(x, y) {
    super(x, y, 'SoC', 120, 120);
    this.subComponents = [
      'CPU Cores',
      'GPU',
      'Memory Controller',
      'I/O Interface'
    ];
  }

  draw(ctx, time) {
    super.draw(ctx, time);

    // Draw internal components
    if (this.active) {
      this.subComponents.forEach((comp, i) => {
        ctx.fillStyle = 'rgba(255, 200, 0, 0.6)';
        ctx.font = '10px monospace';
        ctx.fillText(
          comp,
          this.x,
          this.y - 20 + i * 12
        );
      });
    }
  }
}

export default function PCBBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let soc;
    let modules = [];
    let buses = [];

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const init = () => {
      // Create SoC at center
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      soc = new SoC(centerX, centerY);

      // Create peripheral modules
      const moduleTypes = [
        { type: 'DDR5 Memory', w: 100, h: 60 },
        { type: 'NAND Flash', w: 80, h: 60 },
        { type: 'PCIe Controller', w: 100, h: 50 },
        { type: 'USB Controller', w: 90, h: 50 },
        { type: 'Network Interface', w: 110, h: 50 },
        { type: 'Audio Processor', w: 100, h: 50 }
      ];

      // Position modules around SoC
      moduleTypes.forEach((module, i) => {
        const angle = (i / moduleTypes.length) * Math.PI * 2;
        const radius = 200;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        modules.push(new Module(x, y, module.type, module.w, module.h));
        buses.push(new SystemBus(
          { x: centerX, y: centerY },
          { x, y }
        ));
      });
    };

    const animate = (time) => {
      ctx.fillStyle = 'rgba(10, 15, 18, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Randomly activate modules and send signals
      if (Math.random() < 0.05) {
        const randomModule = Math.floor(Math.random() * modules.length);
        modules[randomModule].active = true;
        buses[randomModule].sendSignal();
        
        // Deactivate after delay
        setTimeout(() => {
          modules[randomModule].active = false;
        }, 1000);
      }

      // Draw all components
      buses.forEach(bus => bus.draw(ctx, time));
      modules.forEach(module => module.draw(ctx, time));
      soc.draw(ctx, time);

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate(0);

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <BackgroundContainer>
      <Canvas ref={canvasRef} />
    </BackgroundContainer>
  );
}
