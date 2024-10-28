import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  background: #0a0a0a;
  overflow: hidden;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

export default function CircuitBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Circuit node class
    class Node {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.connections = [];
        this.size = Math.random() * 2 + 2;
        this.pulseSize = this.size;
        this.pulseSpeed = Math.random() * 0.1 + 0.05;
        this.pulseOffset = Math.random() * Math.PI * 2;
      }

      connect(node) {
        if (!this.connections.includes(node)) {
          this.connections.push(node);
        }
      }

      draw(ctx, time) {
        // Draw connections
        ctx.strokeStyle = '#1a4f7c';
        ctx.lineWidth = 1;
        this.connections.forEach(node => {
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(node.x, node.y);
          ctx.stroke();
        });

        // Draw node with pulse effect
        this.pulseSize = this.size + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 1;
        ctx.fillStyle = '#4a9eff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.pulseSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create initial nodes
    const createNodes = () => {
      const nodes = [];
      const nodeCount = Math.floor((canvas.width * canvas.height) / 15000);
      
      for (let i = 0; i < nodeCount; i++) {
        nodes.push(new Node(
          Math.random() * canvas.width,
          Math.random() * canvas.height
        ));
      }

      // Connect nodes
      nodes.forEach(node => {
        const nearestNodes = nodes
          .filter(n => n !== node)
          .sort((a, b) => {
            const distA = Math.hypot(node.x - a.x, node.y - a.y);
            const distB = Math.hypot(node.x - b.x, node.y - b.y);
            return distA - distB;
          })
          .slice(0, 3);

        nearestNodes.forEach(nearNode => {
          if (Math.hypot(node.x - nearNode.x, node.y - nearNode.y) < 200) {
            node.connect(nearNode);
          }
        });
      });

      return nodes;
    };

    // Animation loop
    const animate = (time) => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(node => {
        node.draw(ctx, time * 0.001);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Initialize
    particles = createNodes();
    animate(0);

    // Cleanup
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
