'use client';

import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(10, 25, 47, 0.95);
  padding: 16px;
  box-sizing: border-box;
  font-family: 'Space Grotesk', sans-serif;
  color: ${({ theme }) => theme.colors.text};
  gap: 16px;
  overflow: hidden;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`;

const DiagnosticsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  .pulse {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #00ff41;
    box-shadow: 0 0 8px #00ff41;
    animation: blink 1.2s infinite alternate;
  }

  span {
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  @keyframes blink {
    0% { opacity: 0.3; }
    100% { opacity: 1; }
  }
`;

const InfoMeta = styled.span`
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  flex-shrink: 0;

  @media (max-width: 580px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const MetricCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid ${({ $color }) => $color}25;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
  overflow: hidden;

  h4 {
    margin: 0;
    font-size: 0.7rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .value {
    font-size: 1.25rem;
    font-weight: 700;
    color: ${({ $color }) => $color};
    font-family: 'IBM Plex Mono', monospace;
  }

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${({ $color }) => $color};
    opacity: 0.3;
  }
`;

const CanvasWrapper = styled.div`
  flex-grow: 1;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  min-height: 150px;
`;

const StyledCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
`;

export default function SystemMonitorApp() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const scrollSpeedRef = useRef(0);
  const lastScrollTimeRef = useRef(Date.now());
  const lastScrollYRef = useRef(window.scrollY);

  // Active numeric metrics state
  const [cpu, setCpu] = useState(12.4);
  const [mem, setMem] = useState(2.41);
  const [ping, setPing] = useState(32);
  const [scrollSpeed, setScrollSpeed] = useState(0);

  // Monitor scroll velocity
  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      const currentScrollY = window.scrollY;
      const timeDiff = Math.max(1, now - lastScrollTimeRef.current);
      const distScrolled = Math.abs(currentScrollY - lastScrollYRef.current);

      // Speed in pixels per second divided by 10 for scaling
      const speed = (distScrolled / timeDiff) * 100;
      scrollSpeedRef.current = Math.min(100, scrollSpeedRef.current + speed);

      lastScrollTimeRef.current = now;
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Canvas render and logic simulation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Resize canvas based on wrapper bounds
    const resizeCanvas = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas.parentElement);

    // Grid data history streams (60 slots)
    const cpuHistory = Array(60).fill(12);
    const memHistory = Array(60).fill(2.4);
    const pingHistory = Array(60).fill(30);
    const scrollHistory = Array(60).fill(0);

    let animationFrameId;
    let lastUpdate = Date.now();

    const drawLoop = () => {
      const now = Date.now();
      const delta = now - lastUpdate;

      // Update values every 100ms
      if (delta >= 100) {
        lastUpdate = now;

        // 1. Simulate CPU (fluctuating arpeggio)
        const nextCpu = Math.max(2, Math.min(98, 12 + Math.sin(now / 1500) * 8 + (Math.random() * 4 - 2)));
        setCpu(nextCpu.toFixed(1));
        cpuHistory.push(nextCpu);
        cpuHistory.shift();

        // 2. Simulate Memory (drift)
        const nextMem = Math.max(1.8, Math.min(6.2, 2.41 + Math.sin(now / 5000) * 0.15 + (Math.random() * 0.02 - 0.01)));
        setMem(nextMem.toFixed(2));
        memHistory.push(nextMem);
        memHistory.shift();

        // 3. Simulate Ping (occasional latency spike)
        const hasSpike = Math.random() > 0.94;
        const nextPing = Math.max(12, Math.min(250, 32 + (hasSpike ? Math.random() * 120 + 80 : Math.random() * 8 - 4)));
        setPing(Math.round(nextPing));
        pingHistory.push(nextPing);
        pingHistory.shift();

        // 4. Update Scroll Speed (with decay)
        const currentSpeed = scrollSpeedRef.current;
        setScrollSpeed(Math.round(currentSpeed));
        scrollHistory.push(currentSpeed);
        scrollHistory.shift();

        // Decay scroll velocity
        scrollSpeedRef.current = Math.max(0, scrollSpeedRef.current * 0.85);
      }

      // Draw canvas elements
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      ctx.clearRect(0, 0, width, height);

      // Draw chart grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const cols = 10;
      const rows = 6;
      for (let i = 1; i < cols; i++) {
        ctx.beginPath();
        ctx.moveTo((width / cols) * i, 0);
        ctx.lineTo((width / cols) * i, height);
        ctx.stroke();
      }
      for (let i = 1; i < rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (height / rows) * i);
        ctx.lineTo(width, (height / rows) * i);
        ctx.stroke();
      }

      // Draw data queues
      const drawLineChart = (data, color, minVal, maxVal) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.shadowColor = color;
        ctx.shadowBlur = 6;
        ctx.beginPath();

        const range = maxVal - minVal;
        const stepX = width / 58;

        data.forEach((val, idx) => {
          const clamped = Math.max(minVal, Math.min(maxVal, val));
          const pct = (clamped - minVal) / range;
          const x = idx * stepX;
          const y = height - pct * (height - 20) - 10; // offset edges

          if (idx === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });

        ctx.stroke();
        ctx.shadowBlur = 0; // reset shadow
      };

      // Draw charts
      drawLineChart(cpuHistory, '#00ff41', 0, 100);     // CPU Green
      drawLineChart(memHistory, '#01cdfe', 1.5, 4.0);  // Memory Cyan
      drawLineChart(pingHistory, '#f97e72', 0, 200);   // Ping Latency Coral
      drawLineChart(scrollHistory, '#a995c9', 0, 150); // Scroll Velocity Purple

      animationFrameId = requestAnimationFrame(drawLoop);
    };

    animationFrameId = requestAnimationFrame(drawLoop);
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <Container ref={containerRef}>
      <HeaderRow>
        <DiagnosticsHeader>
          <div className="pulse" />
          <span>Realtime Metrics Diagnostics</span>
        </DiagnosticsHeader>
        <InfoMeta>INGRESS SPEED: 1.2 GB/S</InfoMeta>
      </HeaderRow>

      <MetricsGrid>
        <MetricCard $color="#00ff41">
          <h4>CPU LOAD</h4>
          <span className="value">{cpu}%</span>
        </MetricCard>
        <MetricCard $color="#01cdfe">
          <h4>MEMORY</h4>
          <span className="value">{mem} GB</span>
        </MetricCard>
        <MetricCard $color="#f97e72">
          <h4>LATENCY</h4>
          <span className="value">{ping} ms</span>
        </MetricCard>
        <MetricCard $color="#a995c9">
          <h4>SCROLL</h4>
          <span className="value">{scrollSpeed} px/s</span>
        </MetricCard>
      </MetricsGrid>

      <CanvasWrapper>
        <StyledCanvas ref={canvasRef} />
      </CanvasWrapper>
    </Container>
  );
}
