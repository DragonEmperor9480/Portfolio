import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const AboutContainer = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  position: relative;
  z-index: 1;
  padding: 70px 20px;
  margin: 0 auto;
  max-width: 1280px;
`;

const TerminalWrapper = styled(motion.div)`
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(10px);
  border-radius: 10px;
  width: 100%;
  max-width: 1200px;
  height: auto;
  min-height: 650px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  font-family: 'JetBrains Mono', monospace;
  margin: 0 auto;
`;

const TerminalHeader = styled.div`
  background: ${({ theme }) => theme.colors.terminalHeader};
  padding: 12px 15px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
`;

const TerminalButton = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
  background: ${props => props.color};
`;

const TerminalTitle = styled.div`
  color: ${({ theme }) => theme.colors.text};
  margin-left: auto;
  margin-right: auto;
  opacity: 0.75;
  font-size: 14px;
`;

const TerminalContent = styled.div`
  padding: 30px;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 20px;
`;

const Command = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  
  .prompt {
    color: #64ffda;
    margin-right: 10px;
    display: flex;
    align-items: center;
    gap: 5px;
    
    i {
      font-size: 12px;
    }
  }
  
  .command-text {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
  }
`;

const Output = styled(motion.div)`
  margin: 10px 0 30px 25px;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.9;
  line-height: 1.8;
  font-size: 0.95rem;
  letter-spacing: 0.3px;
  text-align: justify;
  
  @media (max-width: 768px) {
    text-align: justify;
    padding-right: 25px;
    hyphens: auto;
    word-break: break-word;
  }
`;

const TerminalOutput = styled.div`
  padding: 20px 25px;
  color: ${({ theme }) => theme.colors.text};
  font-family: 'JetBrains Mono', monospace;
  line-height: 1.6;
`;

const CommandPrompt = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  
  &::before {
    content: '[user@portfolio] ~';
    color: ${({ theme }) => theme.colors.secondary};
    margin-right: 10px;
  }
`;

const SkillItem = styled.div`
  margin: 15px 0;
  padding-left: 25px;
  border-left: 1px dashed ${({ theme }) => theme.colors.border};
  
  .skill-name {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
    display: flex;
    align-items: center;
    
    .icon {
      margin-right: 10px;
      font-size: 1.2em;
    }
  }
  
  .skill-desc {
    padding: 5px 0 5px 28px;
    color: ${({ theme }) => theme.colors.text};
    opacity: 0.8;
    position: relative;
    
    &::before {
      content: '└─';
      position: absolute;
      left: 0;
      color: ${({ theme }) => theme.colors.secondary};
    }
  }
`;

const skills = [
  {
    name: 'Android Development',
    icon: '📱',
    description: 'Custom ROM & Android app development'
  },
  {
    name: 'System Programming',
    icon: '🔧',
    description: 'Low-level system optimization'
  },
  {
    name: 'AI & Machine Learning',
    icon: '🤖',
    description: 'ML models & AI applications'
  },
  {
    name: 'Problem Solving',
    icon: '🚀',
    description: 'Algorithmic & analytical thinking'
  },
  {
    name: 'Custom ROM Development',
    icon: '💻',
    description: 'Android system customization'
  }
];

export default function About() {
  const [commands, setCommands] = useState([]);
  const [currentCommand, setCurrentCommand] = useState(0);

  const terminalCommands = [
    {
      command: 'whoami',
      output: 'Amrutesh Naregal - Tech Enthusiast & ROM Developer'
    },
    {
      command: 'cat about.txt',
      output: `I am a passionate tech enthusiast and custom ROM maintainer. My journey in the world of technology has led me to explore the intricate details of Android development and system customization.

As a custom ROM maintainer, I work on optimizing and enhancing Android operating systems, providing users with improved performance, additional features, and a more personalized mobile experience.`
    },
    {
      command: 'ls ./skills/',
      output: (
        <TerminalOutput>
          <CommandPrompt>ls -l ~/skills</CommandPrompt>
          {skills.map((skill, index) => (
            <SkillItem key={index}>
              <div className="skill-name">
                <span className="icon">{skill.icon}</span>
                {skill.name}
              </div>
              <div className="skill-desc">{skill.description}</div>
            </SkillItem>
          ))}
        </TerminalOutput>
      )
    }
  ];

  useEffect(() => {
    if (currentCommand < terminalCommands.length) {
      const timer = setTimeout(() => {
        setCommands(prev => [...prev, terminalCommands[currentCommand]]);
        setCurrentCommand(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentCommand]);

  return (
    <AboutContainer id="about">
      <TerminalWrapper
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <TerminalHeader>
          <TerminalButton color="#ff5f56"/>
          <TerminalButton color="#ffbd2e"/>
          <TerminalButton color="#27c93f"/>
          <TerminalTitle>user@portfolio: ~/skills</TerminalTitle>
        </TerminalHeader>
        
        <TerminalContent>
          {commands.map((cmd, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Command>
                <span className="prompt">➜</span>
                <span className="command-text">{cmd.command}</span>
              </Command>
              <Output>{cmd.output}</Output>
            </motion.div>
          ))}
          <Command>
            <span className="prompt">➜</span>
            <motion.span 
              className="cursor"
              animate={{ opacity: [0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              █
            </motion.span>
          </Command>
        </TerminalContent>
      </TerminalWrapper>
    </AboutContainer>
  );
}