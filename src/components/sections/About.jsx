import styled from 'styled-components';
import { motion } from 'framer-motion';

const AboutContainer = styled.section`
  min-height: 100vh;
  width: 100%;
  position: relative;
  z-index: 1;
  padding: 100px 20px;
  margin: 0 auto;
  max-width: 1400px;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 80px;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 4rem;
  font-weight: 800;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #00ff88);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.7;
  max-width: 600px;
  margin: 0 auto;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 80px;
  align-items: start;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 60px;
  }
`;

const ProfileCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 100px;
  
  @media (max-width: 1024px) {
    position: static;
  }
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const ProfileTitle = styled.h3`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 10px;
  font-weight: 600;
`;

const ProfileRoles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Role = styled.div`
  background: rgba(100, 255, 218, 0.1);
  color: #00ff88;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid rgba(100, 255, 218, 0.2);
`;

const ProfileStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 30px;
`;

const Stat = styled.div`
  text-align: center;
  
  .number {
    font-size: 2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
    display: block;
  }
  
  .label {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.text};
    opacity: 0.7;
  }
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
`;

const AboutSection = styled(motion.div)`
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  
  h3 {
    font-size: 1.8rem;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 20px;
    font-weight: 600;
  }
  
  p {
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.8;
    font-size: 1.1rem;
    margin-bottom: 20px;
    
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
    background: rgba(0, 255, 136, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
  }
`;

const SkillsSection = styled(motion.div)`
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  
  h3 {
    font-size: 1.8rem;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 30px;
    font-weight: 600;
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const SkillCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  .skill-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    
    .skill-icon {
      width: 12px;
      height: 12px;
      background: ${({ theme }) => theme.colors.primary};
      border-radius: 50%;
      margin-right: 12px;
    }
    
    .skill-name {
      color: ${({ theme }) => theme.colors.text};
      font-weight: 600;
      font-size: 1rem;
    }
  }
  
  .skill-desc {
    color: ${({ theme }) => theme.colors.text};
    opacity: 0.8;
    line-height: 1.6;
    margin-bottom: 16px;
    font-size: 0.95rem;
  }
  
  .tech-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    
    .tech-tag {
      background: rgba(100, 255, 218, 0.1);
      color: #00ff88;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-family: 'JetBrains Mono', monospace;
      border: 1px solid rgba(100, 255, 218, 0.2);
    }
  }
`;

const skills = [
  {
    name: 'Cloud Engineering',
    description: 'Designing and implementing scalable cloud infrastructure and services',
    techStack: ['AWS', 'Azure', 'GCP', 'Terraform', 'CloudFormation']
  },
  {
    name: 'Containerization',
    description: 'Basic containerization knowledge and Docker fundamentals',
    techStack: ['Docker', 'Docker Compose']
  },
  {
    name: 'Backend Development',
    description: 'Building robust APIs and microservices architecture',
    techStack: ['Node.js', 'Python', 'Go', 'PostgreSQL', 'MongoDB']
  },
  {
    name: 'Linux Systems',
    description: 'System administration and optimization on Linux environments',
    techStack: ['Arch Linux', 'KDE', 'Bash', 'SystemD', 'Networking']
  },
  {
    name: 'Android Tinkering',
    description: 'Custom ROM development and Android system customization as a hobby',
    techStack: ['AOSP', 'ADB', 'Fastboot', 'Magisk', 'Custom Recovery']
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
          Cloud Engineer • Backend Developer • Custom ROM Enthusiast
        </SectionSubtitle>
      </SectionHeader>

      <MainContent>
        <ProfileCard
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <ProfileHeader>
            <ProfileTitle>Amrutesh Naregal</ProfileTitle>
            <ProfileRoles>
              <Role>Cloud Engineer</Role>
              <Role>Backend Developer</Role>
              <Role>ROM Developer</Role>
            </ProfileRoles>
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
              I'm a passionate <span className="highlight">Cloud Engineer</span> with expertise in
              <span className="tech">backend development</span>. I architect scalable cloud solutions
              and build robust, high-performance applications that serve users reliably.
            </p>
            <p>
              My professional stack spans <span className="tech">cloud platforms</span> and
              <span className="tech">backend technologies</span>. I'm passionate about building efficient systems
              that scale seamlessly while maintaining <span className="highlight">reliability</span> and
              <span className="highlight">security best practices</span>.
            </p>
            <p>
              Outside of work, I'm an <span className="tech">Arch Linux</span> enthusiast running
              <span className="tech">KDE Plasma</span> who loves to tinker with Android. I build
              <span className="highlight">custom ROMs for fun</span>, exploring the depths of Android
              customization and system optimization as a hobby project.
            </p>
          </AboutSection>

          <SkillsSection
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <h3>Technical Expertise</h3>
            <SkillsGrid>
              {skills.map((skill, index) => (
                <SkillCard
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
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