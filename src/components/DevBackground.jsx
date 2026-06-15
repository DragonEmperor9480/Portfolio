'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colors.background};
  z-index: 0;
  overflow: hidden;
`;

// Removed text-shadow — it forces a repaint on every animation frame
const Code = styled(motion.pre)`
  color: ${({ theme }) => `${theme.colors.primary}40`};
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.2rem;
  line-height: 1.5;
  pointer-events: none;
  position: absolute;
  white-space: pre-wrap;
  opacity: 0.7;
  z-index: 1;
  will-change: transform;
`;

// Removed filter: drop-shadow — expensive per-frame GPU operation
const FloatingIcon = styled(motion.i)`
  color: ${({ theme }) => `${theme.colors.primary}50`};
  font-size: 2rem;
  position: absolute;
  pointer-events: none;
  z-index: 1;
  will-change: transform;
`;

const DEV_QUOTES = [
  "Code is like humor. When you have to explain it, it's bad.",
  "It works on my machine!",
  "There are 2 hard problems in CS: cache invalidation, naming things, & off-by-1 errors",
  "// This code works, don't touch it",
  "404: Sleep not found",
];

const devQuotes = [
  "if (brain != empty) { keepCoding(); }",
  "while (!succeed) { try(); }",
  "eat() sleep() code() repeat()",
  "// TODO: Write better code",
  "git commit -m 'Fixed bugs'",
  "console.log('Hello World');",
  "function solve() { coffee.drink(); }",
  "const life = new Promise();",
];

const iconList = [
  "fab fa-react",
  "fab fa-js",
  "fab fa-html5",
  "fab fa-css3",
  "fab fa-node",
  "fab fa-python",
  "fas fa-code",
  "fas fa-database",
  "fab fa-github",
  "fab fa-docker",
  "fab fa-aws",
  "fab fa-angular",
];

export default function DevBackground() {
  const [floatingElements, setFloatingElements] = useState([]);

  useEffect(() => {
    const elements = [];
    const w = window.innerWidth;
    const h = window.innerHeight;

    // 12 icons (was 25)
    for (let i = 0; i < 12; i++) {
      elements.push({
        id: `icon-${i}`,
        type: 'icon',
        content: iconList[Math.floor(Math.random() * iconList.length)],
        x: Math.random() * w,
        y: Math.random() * h,
        // Longer durations = fewer frames needed per cycle
        duration: 25 + Math.random() * 20,
        delay: Math.random() * -20,
        scale: 0.8 + Math.random() * 0.5,
        // Reduced movement range — less distance = smoother on low-end devices
        driftX: 60 + Math.random() * 60,
        driftY: 60 + Math.random() * 60,
      });
    }

    // 8 code snippets (was 15)
    for (let i = 0; i < 8; i++) {
      elements.push({
        id: `text-${i}`,
        type: 'text',
        content: devQuotes[Math.floor(Math.random() * devQuotes.length)],
        x: Math.random() * Math.max(w - 280, 10),
        y: Math.random() * h,
        duration: 30 + Math.random() * 20,
        delay: Math.random() * -20,
        scale: 0.7 + Math.random() * 0.3,
        driftX: 50 + Math.random() * 40,
        driftY: 50 + Math.random() * 40,
      });
    }

    // 5 dev quotes (was 10)
    for (let i = 0; i < 5; i++) {
      elements.push({
        id: `quote-${i}`,
        type: 'quote',
        content: DEV_QUOTES[Math.floor(Math.random() * DEV_QUOTES.length)],
        x: Math.random() * Math.max(w - 280, 10),
        y: Math.random() * h,
        duration: 35 + Math.random() * 25,
        delay: Math.random() * -20,
        scale: 0.8 + Math.random() * 0.2,
        driftX: 40 + Math.random() * 40,
        driftY: 40 + Math.random() * 40,
      });
    }

    setFloatingElements(elements);
  }, []);

  return (
    <Background>
      {floatingElements.map((element) => {
        if (element.type === 'icon') {
          return (
            <FloatingIcon
              key={element.id}
              className={element.content}
              style={{
                fontSize: `${element.scale * 2}rem`,
                willChange: 'transform',
              }}
              animate={{
                // Only animating x, y, opacity — no rotate (saves layout recalc)
                x: [element.x, element.x + element.driftX, element.x - element.driftX, element.x],
                y: [element.y, element.y - element.driftY, element.y + element.driftY, element.y],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: element.duration,
                delay: element.delay,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          );
        }

        return (
          <Code
            key={element.id}
            style={{
              fontSize: `${element.scale * 1.1}rem`,
              maxWidth: '280px',
              willChange: 'transform',
            }}
            animate={{
              x: [element.x, element.x + element.driftX, element.x - element.driftX, element.x],
              y: [element.y, element.y - element.driftY, element.y + element.driftY, element.y],
              opacity: element.type === 'quote' ? [0.7, 0.85, 0.7] : [0.5, 0.7, 0.5],
            }}
            transition={{
              duration: element.duration,
              delay: element.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {element.content}
          </Code>
        );
      })}
    </Background>
  );
}
