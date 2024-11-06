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

const Terminal = styled(motion.div)`
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
  background: rgba(10, 25, 47, 0.7);
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TerminalTitle = styled.div`
  color: #64ffda;
  display: flex;
  align-items: center;
  gap: 8px;
  
  i {
    font-size: 14px;
  }
`;

const TerminalContent = styled.div`
  padding: 20px;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

const Command = styled.div`
  margin-bottom: 15px;
  
  .prompt {
    color: #64ffda;
    margin-right: 10px;
  }
  
  .command-text {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Output = styled(motion.div)`
  margin: 10px 0 20px 25px;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.8;
  line-height: 1.6;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const SkillCard = styled(motion.div)`
  background: rgba(100, 255, 218, 0.05);
  border: 1px solid rgba(100, 255, 218, 0.1);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;

  .icon {
    font-size: 1.5rem;
    color: #64ffda;
  }

  .skill-info {
    .skill-name {
      font-weight: 600;
      color: #64ffda;
    }
    .skill-description {
      font-size: 0.8rem;
      opacity: 0.8;
      margin-top: 0.25rem;
    }
  }

  &:hover {
    background: rgba(100, 255, 218, 0.1);
    transform: translateY(-2px);
    transition: all 0.3s ease;
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
        <SkillsGrid>
          {skills.map((skill, index) => (
            <SkillCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="icon">{skill.icon}</span>
              <div className="skill-info">
                <div className="skill-name">{skill.name}</div>
                <div className="skill-description">{skill.description}</div>
              </div>
            </SkillCard>
          ))}
        </SkillsGrid>
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
      <Terminal
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <TerminalHeader>
          <TerminalTitle>
            <i className="fas fa-terminal"></i>
            about@amrutesh:~
          </TerminalTitle>
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
      </Terminal>
    </AboutContainer>
  );
}