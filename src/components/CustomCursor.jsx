import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const CursorDot = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  background: #00ff41;
  border-radius: 50%;
  pointer-events: none;
  z-index: 10000;
  transition: transform 0.15s ease-out;
  box-shadow: 0 0 10px rgba(0, 255, 65, 0.5);

  @media (max-width: 768px) {
    display: none;
  }
`;

const CursorRing = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 32px;
  height: 32px;
  border: 2px solid #00ff41;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transition: transform 0.2s ease-out, width 0.2s ease, height 0.2s ease;
  opacity: 0.6;

  @media (max-width: 768px) {
    display: none;
  }
`;

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      // Smooth follow for dot
      dotPos.current.x += (mousePos.current.x - dotPos.current.x) * 0.3;
      dotPos.current.y += (mousePos.current.y - dotPos.current.y) * 0.3;

      // Slower follow for ring
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.15;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotPos.current.x - 4}px, ${dotPos.current.y - 4}px)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x - 16}px, ${ringPos.current.y - 16}px)`;
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      <CursorDot ref={dotRef} />
      <CursorRing ref={ringRef} />
    </>
  );
}
