import styled from 'styled-components';
import { motion } from 'framer-motion';

const AboutContainer = styled.section`
  min-height: 100vh;
  width: 100%;
  position: relative;
  z-index: 1;
  padding: 120px 20px;
  margin: 0 auto;
  max-width: 1200px;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 100px;
  position: relative;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 3.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #00ff88);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
  position: relative;
  
  &::before {
    content: '< ';
    color: ${({ theme }) => theme.colors.primary};
    opacity: 0.6;
  }
  
  &::after {
    content: ' />';
    color: ${({ theme }) => theme.colors.primary};
    opacity: 0.6;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 700px;
  margin: 0 auto 30px;
  line-height: 1.6;
`;

const TerminalLine = styled(motion.div)`
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.primary};
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 20px;
  border-radius: 12px;
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
  max-width: 500px;
  margin: 0 auto;
  
  .prompt {
    color: #00ff88;
    margin-right: 8px;
  }
  
  .command {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 60px;
  align-items: start;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 50px;
  }
`;

const ProfileCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 120px;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${({ theme }) => theme.colors.primary}, transparent);
    opacity: 0.5;
  }
  
  @media (max-width: 1024px) {
    position: static;
  }
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 28px;
  position: relative;
`;

const ProfileTitle = styled.h3`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
  
  &::before {
    content: 'const ';
    color: ${({ theme }) => theme.colors.primary};
    font-size: 0.9rem;
  }
  
  &::after {
    content: ' = {';
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.9rem;
  }
`;

const ProfileRoles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 16px;
`;

const Role = styled.div`
  background: linear-gradient(45deg, rgba(100, 255, 218, 0.05), rgba(100, 255, 218, 0.1));
  color: ${({ theme }) => theme.colors.primary};
  padding: 8px 14px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid rgba(100, 255, 218, 0.15);
  font-family: 'JetBrains Mono', monospace;
  text-align: center;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 4px 12px rgba(100, 255, 218, 0.1);
  }
  
  &::before {
    content: '• ';
    opacity: 0.7;
  }
`;

const ProfileStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Stat = styled.div`
  text-align: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }
  
  .number {
    font-size: 1.8rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
    display: block;
    font-family: 'JetBrains Mono', monospace;
  }
  
  .label {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-top: 4px;
    font-weight: 500;
  }
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const AboutSection = styled(motion.div)`
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 36px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${({ theme }) => theme.colors.primary}, transparent);
    opacity: 0.4;
  }
  
  h3 {
    font-size: 1.6rem;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 24px;
    font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
    display: flex;
    align-items: center;
    
    &::before {
      content: '> ';
      color: ${({ theme }) => theme.colors.primary};
      margin-right: 8px;
      font-size: 1.2rem;
    }
    
    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary}, transparent);
      margin-left: 16px;
      opacity: 0.3;
    }
  }
  
  p {
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.7;
    font-size: 1.05rem;
    margin-bottom: 18px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .highlight {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
  }
  
  .tech {
    font-family: 'JetBrains Mono', monospace;
    color: #00ff88;
    font-weight: 500;
    background: rgba(0, 255, 136, 0.08);
    padding: 3px 8px;
    border-radius: 6px;
    border: 1px solid rgba(0, 255, 136, 0.15);
    margin: 0 2px;
  }
`;

const SkillsSection = styled(motion.div)`
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 36px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${({ theme }) => theme.colors.primary}, transparent);
    opacity: 0.4;
  }
  
  h3 {
    font-size: 1.6rem;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 32px;
    font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
    display: flex;
    align-items: center;
    
    &::before {
      content: '> ';
      color: ${({ theme }) => theme.colors.primary};
      margin-right: 8px;
      font-size: 1.2rem;
    }
    
    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary}, transparent);
      margin-left: 16px;
      opacity: 0.3;
    }
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
`;

const SkillCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01));
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary}, transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    border-color: ${({ theme }) => theme.colors.primary};
    
    &::before {
      opacity: 1;
    }
  }
  
  .skill-header {
    display: flex;
    align-items: center;
    margin-bottom: 14px;
    
    .skill-icon {
      width: 8px;
      height: 8px;
      background: ${({ theme }) => theme.colors.primary};
      border-radius: 50%;
      margin-right: 10px;
      box-shadow: 0 0 8px ${({ theme }) => theme.colors.primary};
    }
    
    .skill-name {
      color: ${({ theme }) => theme.colors.text};
      font-weight: 600;
      font-size: 0.95rem;
      font-family: 'JetBrains Mono', monospace;
    }
  }
  
  .skill-desc {
    color: ${({ theme }) => theme.colors.textSecondary};
    line-height: 1.6;
    margin-bottom: 16px;
    font-size: 0.9rem;
  }
  
  .tech-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    
    .tech-tag {
      background: rgba(100, 255, 218, 0.08);
      color: ${({ theme }) => theme.colors.primary};
      padding: 4px 8px;
      border-radius: 8px;
      font-size: 0.75rem;
      font-family: 'JetBrains Mono', monospace;
      border: 1px solid rgba(100, 255, 218, 0.15);
      transition: all 0.2s ease;
      
      &:hover {
        background: rgba(100, 255, 218, 0.12);
        border-color: ${({ theme }) => theme.colors.primary};
      }
    }
  }
`;

const skills = [
  {
    name: 'Cloud Engineering',
    description: 'Designing and implementing scalable cloud infrastructure and services',
    techStack: ['AWS', 'Azure', 'GCP']
  },
  {
    name: 'Containerization',
    description: 'Basic containerization knowledge and Docker fundamentals',
    techStack: ['Docker', 'Docker Compose']
  },
  {
    name: 'Backend Development',
    description: 'Building robust APIs and microservices architecture',
    techStack: ['Java','Node.js', 'Python', 'Go', 'SQL']
  },
  {
    name: 'Linux Systems',
    description: 'Advanced Linux knowledge and experience for 10+ years',
    techStack: ['Arch Linux', 'KDE', 'Bash', 'SystemD', 'Networking']
  },
  {
    name: 'Android Tinkering',
    description: 'Custom ROM development and Android system customization as a hobby',
    techStack: ['AOSP', 'ADB', 'Fastboot', 'root', 'Custom Recovery']
  }
];

export default function About() {
  return (
    <AboutContainer id="about">
      <SectionHeader>
        <SectionTitle
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          About Me
        </SectionTitle>
        <SectionSubtitle
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px 24px',
            margin: '0 auto',
            maxWidth: '600px'
          }}>
            <span style={{ color: '#ff4757', fontFamily: "'JetBrains Mono', monospace" }}>
              System.out.println("Error: No information found");
            </span>
            <br />
            <span style={{ color: '#40e87eff', fontFamily: "'JetBrains Mono', monospace" }}>
              please use the command "whoami --roles" to get information about me;
            </span>
          </div>
        </SectionSubtitle>
        <TerminalLine
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <span className="prompt">$</span>
          <span className="command">whoami --roles</span>
        </TerminalLine>
      </SectionHeader>

      <MainContent>
        <ProfileCard
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <ProfileHeader>
            <ProfileTitle>AmruteshNaregal</ProfileTitle>
            <ProfileRoles>
              <Role>Cloud Engineer</Role>
              <Role>Backend Developer</Role>
              <Role>ROM Developer</Role>
            </ProfileRoles>
            <div style={{ 
              fontFamily: "'JetBrains Mono', monospace", 
              color: '#64ffda', 
              fontSize: '0.9rem', 
              marginTop: '12px',
              opacity: 0.7
            }}>
              {'}'}
            </div>
          </ProfileHeader>

          <ProfileStats>
            <Stat>
              <span className="number">5+</span>
              <span className="label">Years ROM Building</span>
            </Stat>
            <Stat>
              <span className="number">100+</span>
              <span className="label">ROMs Released</span>
            </Stat>
          </ProfileStats>
        </ProfileCard>

        <ContentSection>
          <AboutSection
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <h3>My Journey</h3>
            <p>
              Spent my childhood playing games like <span className="tech">GTA Vice City</span>, <span className="tech">AxySnake</span>, 
              <span className="tech">Mario Forever</span> etc. Broke some game key requirements and experimented with 
              <span className="tech">GTA</span> with my own weird mods. Tried <span className="tech">Ubuntu</span> linux for the first time 
              in 8th class and built computers at home. Printed <span className="highlight">Hello World</span> in 2017.
            </p>
            <p>
              Got addicted to <span className="highlight">Custom ROM Development</span> and <span className="tech">git</span> since 
              first year of college. Built my first Android application using <span className="tech">Java</span>. 
              Also started tinkering with other languages. When I started using free wifi, I went 
               <span className="highlight"> linux distro hopping</span>. Currently joined the <span className="tech">Arch Linux</span> cult.
            </p>
            <p>
              Now playing with <span className="tech">golang</span> as a <span className="highlight">backend engineer</span> in the company 
              and also handling cloud stuff like <span className="tech">S3</span>, <span className="tech">Lambda</span>, 
              <span className="tech">Cognito</span>, <span className="tech">CloudWatch</span>, <span className="tech">CloudFront</span>, 
              <span className="tech">AWS SDK</span>, <span className="tech">DynamoDB</span>, and <span className="tech">Aurora</span>.
            </p>
          </AboutSection>

          <SkillsSection
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3>Technical Expertise</h3>
            <SkillsGrid>
              {skills.map((skill, index) => (
                <SkillCard
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                >
                  <div className="skill-header">
                    <div className="skill-icon"></div>
                    <div className="skill-name">{skill.name}</div>
                  </div>
                  <div className="skill-desc">{skill.description}</div>
                  <div className="tech-stack">
                    {skill.techStack.map((tech, techIndex) => (
                      <span key={techIndex} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </SkillCard>
              ))}
            </SkillsGrid>
          </SkillsSection>
        </ContentSection>
      </MainContent>
    </AboutContainer>
  );
}