import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  background: linear-gradient(135deg, #0a192f 0%, #112240 100%);
  overflow: hidden;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

class Particle {
  constructor(x, y, canvas) {
    this.x = x;
    this.y = y;
    this.canvas = canvas;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.color = '#64ffda';
    this.originalX = x;
    this.originalY = y;
    this.density = (Math.random() * 30) + 1;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  update(mouse) {
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const forceDirectionX = dx / distance;
    const forceDirectionY = dy / distance;
    const maxDistance = mouse.radius;
    const force = (maxDistance - distance) / maxDistance;
    const directionX = forceDirectionX * force * this.density;
    const directionY = forceDirectionY * force * this.density;

    if (distance < mouse.radius) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.originalX) {
        const dx = this.x - this.originalX;
        this.x -= dx/10;
      }
      if (this.y !== this.originalY) {
        const dy = this.y - this.originalY;
        this.y -= dy/10;
      }
    }
  }
}

// Add development quotes
const DEV_QUOTES = [
  'npm install',
  'git push origin main',
  'docker build -t',
  'react-query',
  'useState()',
  'useEffect()',
  'async/await',
  'kubectl deploy',
  'yarn add',
  'next build',
  'prettier --write',
  'eslint fix',
  'jest --watch',
  'vite dev',
  'tailwind.config.js',
  'AWS Lambda',
  'MongoDB Atlas',
  'Redux Toolkit',
  'TypeScript <T>',
  'GraphQL Query',
  'CI/CD Pipeline',
  'React.memo()',
  'docker-compose up',
  'npm run build',
];

class TextParticle {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.text = DEV_QUOTES[Math.floor(Math.random() * DEV_QUOTES.length)];
    this.speed = 0.3; // Slower speed for better visibility
    this.size = Math.random() * 12 + 14; // Larger size: 14-26px
    this.opacity = Math.random() * 0.3 + 0.2; // Higher opacity: 0.2-0.5
    this.direction = Math.random() > 0.5 ? 1 : -1;
  }

  draw(ctx) {
    ctx.font = `${this.size}px "Fira Code", Consolas, monospace`;
    ctx.fillStyle = `rgba(100, 255, 218, ${this.opacity})`;
    ctx.textAlign = 'center'; // Center the text
    ctx.fillText(this.text, this.x, this.y);
  }

  update() {
    this.y -= this.speed;
    this.x += this.speed * 0.1 * this.direction;

    // Reset position when text goes off screen
    if (this.y < 0) {
      this.y = this.canvas.height;
      this.x = Math.random() * this.canvas.width;
      this.text = DEV_QUOTES[Math.floor(Math.random() * DEV_QUOTES.length)];
      this.opacity = Math.random() * 0.3 + 0.2;
      this.size = Math.random() * 12 + 14;
    }
    if (this.x < 0 || this.x > this.canvas.width) {
      this.direction *= -1;
    }
  }
}

export default function InteractiveBackground() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const textParticlesRef = useRef([]);
  const mouseRef = useRef({ x: null, y: null, radius: 150 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Create particles
      particlesRef.current = [];
      const numberOfParticles = (canvas.width * canvas.height) / 15000;
      
      for (let i = 0; i < numberOfParticles; i++) {
        particlesRef.current.push(
          new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            canvas
          )
        );
      }

      // Create more text particles
      textParticlesRef.current = [];
      const numberOfTexts = 25; // Increased number of text particles
      
      for (let i = 0; i < numberOfTexts; i++) {
        textParticlesRef.current.push(new TextParticle(canvas));
      }
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 25, 47, 0.05)'; // More subtle trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw text particles first (behind the connection lines)
      textParticlesRef.current.forEach(text => {
        text.update();
        text.draw(ctx);
      });

      // Update and draw particles
      particlesRef.current.forEach(particle => {
        particle.update(mouseRef.current);
        particle.draw(ctx);
      });

      // Connect nearby particles
      connectParticles(ctx);

      animationFrameId = requestAnimationFrame(animate);
    };

    const connectParticles = (ctx) => {
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x;
          const dy = particlesRef.current[i].y - particlesRef.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100, 255, 218, ${1 - distance/100})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const handleMouseMove = (event) => {
      mouseRef.current.x = event.x;
      mouseRef.current.y = event.y;
    };

    const handleResize = () => {
      init();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    init();
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <BackgroundContainer>
      <Canvas ref={canvasRef} />
    </BackgroundContainer>
  );
}
