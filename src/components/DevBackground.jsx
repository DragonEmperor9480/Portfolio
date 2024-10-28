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
  text-shadow: 0 0 10px ${({ theme }) => `${theme.colors.primary}30`}};
`;

const FloatingIcon = styled(motion.i)`
  color: ${({ theme }) => `${theme.colors.primary}50`};
  font-size: 2rem;
  position: absolute;
  pointer-events: none;
  z-index: 1;
  filter: drop-shadow(0 0 8px ${({ theme }) => `${theme.colors.primary}40`});
`;

const DEV_QUOTES = [
  "Code is like humor. When you have to explain it, it's bad.",
  "It works on my machine!",
  "There are 2 hard problems in CS: cache invalidation, naming things, & off-by-1 errors",
  "// This code works, don't touch it",
  "404: Sleep not found",
  "Eat. Sleep. Code. Debug. Repeat.",
  "Keep calm and git push --force",
  "I don't always test my code, but when I do, I do it in production",
  "SELECT coffee FROM brain WHERE awake = false",
  "!false === true // funny because it's true",
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
  "catch (errors) { fix(errors); }",
  "// Code never lies, comments sometimes do",
  "import { success } from 'hardwork'",
  "export default function Dream() { }",
  "git push --force-with-lease",
  "npm install happiness",
  "docker run life.js",
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
  "fab fa-vuejs",
  "fab fa-sass",
  "fab fa-bootstrap",
];

export default function DevBackground() {
  const [floatingElements, setFloatingElements] = useState([]);

  useEffect(() => {
    const elements = [];
    
    // Add 25 icons (reduced from 30 for better visibility)
    for (let i = 0; i < 25; i++) {
      elements.push({
        id: `icon-${i}`,
        type: 'icon',
        content: iconList[Math.floor(Math.random() * iconList.length)],
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        duration: 15 + Math.random() * 20, // Reduced duration for faster movement
        delay: Math.random() * -15,
        scale: 0.8 + Math.random() * 0.5,
        rotation: Math.random() * 360,
      });
    }
    
    // Add 15 code snippets
    for (let i = 0; i < 15; i++) {
      elements.push({
        id: `text-${i}`,
        type: 'text',
        content: devQuotes[Math.floor(Math.random() * devQuotes.length)],
        x: Math.random() * (window.innerWidth - 300), // Prevent text from going off-screen
        y: Math.random() * window.innerHeight,
        duration: 20 + Math.random() * 25,
        delay: Math.random() * -15,
        scale: 0.7 + Math.random() * 0.3,
        rotation: -20 + Math.random() * 40,
      });
    }
    
    // Add 10 DEV_QUOTES
    for (let i = 0; i < 10; i++) {
      elements.push({
        id: `quote-${i}`,
        type: 'quote',
        content: DEV_QUOTES[Math.floor(Math.random() * DEV_QUOTES.length)],
        x: Math.random() * (window.innerWidth - 300),
        y: Math.random() * window.innerHeight,
        duration: 25 + Math.random() * 30,
        delay: Math.random() * -15,
        scale: 0.8 + Math.random() * 0.2,
        rotation: -15 + Math.random() * 30,
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
              style={{ fontSize: `${element.scale * 2}rem` }}
              animate={{
                x: [
                  element.x,
                  element.x + 150 * Math.random(), // Increased movement range
                  element.x - 150 * Math.random(),
                  element.x,
                ],
                y: [
                  element.y,
                  element.y - 150 * Math.random(),
                  element.y + 150 * Math.random(),
                  element.y,
                ],
                rotate: [0, element.rotation, -element.rotation, 0],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: element.duration,
                delay: element.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          );
        } else {
          // Handle both text and quotes with different styles
          return (
            <Code
              key={element.id}
              style={{ 
                fontSize: `${element.scale * 1.2}rem`,
                maxWidth: '300px',
                color: element.type === 'quote' 
                  ? ({ theme }) => `${theme.colors.primary}60` // More visible for quotes
                  : ({ theme }) => `${theme.colors.primary}40`,
                opacity: element.type === 'quote' ? 0.9 : 0.7, // More visible for quotes
              }}
              animate={{
                x: [
                  element.x,
                  element.x + 100 * Math.random(),
                  element.x - 100 * Math.random(),
                  element.x,
                ],
                y: [
                  element.y,
                  element.y - 100 * Math.random(),
                  element.y + 100 * Math.random(),
                  element.y,
                ],
                rotate: [element.rotation, element.rotation + 10, element.rotation - 10, element.rotation],
                opacity: element.type === 'quote' ? [0.8, 0.9, 0.8] : [0.6, 0.8, 0.6],
              }}
              transition={{
                duration: element.duration,
                delay: element.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {element.content}
            </Code>
          );
        }
      })}
    </Background>
  );
}
