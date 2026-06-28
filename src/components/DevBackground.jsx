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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile = window.innerWidth < 768 || navigator.maxTouchPoints > 0;
    setIsMobile(mobile);

    const elements = [];
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Drastically reduce element counts on mobile (total 7 static items vs 25 animated on desktop)
    const iconCount = mobile ? 4 : 12;
    const textCount = mobile ? 2 : 8;
    const quoteCount = mobile ? 1 : 5;

    // Icons
    for (let i = 0; i < iconCount; i++) {
      elements.push({
        id: `icon-${i}`,
        type: 'icon',
        content: iconList[Math.floor(Math.random() * iconList.length)],
        x: Math.random() * w,
        y: Math.random() * h,
        duration: 25 + Math.random() * 20,
        delay: Math.random() * -20,
        scale: 0.8 + Math.random() * 0.5,
        driftX: 60 + Math.random() * 60,
        driftY: 60 + Math.random() * 60,
      });
    }

    // Code snippets
    for (let i = 0; i < textCount; i++) {
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

    // Dev quotes
    for (let i = 0; i < quoteCount; i++) {
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
        const styleProps = {
          fontSize: element.type === 'icon' ? `${element.scale * 2}rem` : `${element.scale * 1.1}rem`,
          maxWidth: element.type === 'icon' ? undefined : '280px',
          left: `${element.x}px`,
          top: `${element.y}px`,
          willChange: 'transform',
        };

        if (element.type === 'icon') {
          return (
            <FloatingIcon
              key={element.id}
              className={element.content}
              style={styleProps}
              // Completely disable motion animation on mobile devices to prevent GPU and layout updates
              animate={isMobile ? undefined : {
                x: [0, element.driftX, -element.driftX, 0],
                y: [0, -element.driftY, element.driftY, 0],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={isMobile ? undefined : {
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
            style={styleProps}
            // Completely disable motion animation on mobile devices to prevent GPU and layout updates
            animate={isMobile ? undefined : {
              x: [0, element.driftX, -element.driftX, 0],
              y: [0, -element.driftY, element.driftY, 0],
              opacity: element.type === 'quote' ? [0.7, 0.85, 0.7] : [0.5, 0.7, 0.5],
            }}
            transition={isMobile ? undefined : {
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
