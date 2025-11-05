import styled from 'styled-components';
import { motion } from 'framer-motion';

const AboutContainer = styled.section`
  min-height: 100vh;
  width: 100%;
  position: relative;
  z-index: 1;
  padding: 120px 20px 80px;
  margin: 0 auto;
  max-width: 1400px;

  @media (max-width: 1024px) {
    padding: 100px 20px 60px;
  }

  @media (max-width: 768px) {
    padding: 80px 15px 50px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(20px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  padding: 50px 40px 40px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, ${({ theme }) => theme.colors.primary}, transparent);
    opacity: 0.6;
  }

  @media (max-width: 768px) {
    margin-bottom: 40px;
    padding: 40px 30px 30px;
  }

  @media (max-width: 480px) {
    padding: 30px 20px 20px;
  }
`;

const Title = styled(motion.h2)`
  font-size: 4rem;
  font-weight: 800;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #00ff88);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  font-family: 'JetBrains Mono', monospace;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const FullWidthSection = styled.div`
  width: 100%;
  margin-bottom: 50px;
`;

const Card = styled(motion.div)`
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(20px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 40px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary}, transparent);
  }

  @media (max-width: 768px) {
    padding: 28px;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.text};
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  margin-bottom: 28px;
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: -0.01em;

  &::before {
    content: '//';
    color: ${({ theme }) => theme.colors.primary};
    opacity: 0.8;
    font-size: 1.4rem;
  }
`;

const InfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  font-family: 'JetBrains Mono', monospace;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.05rem;
  min-width: 140px;
  font-weight: 700;
  letter-spacing: 0.02em;

  @media (max-width: 768px) {
    min-width: 110px;
    font-size: 0.95rem;
  }
`;

const InfoValue = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.1rem;
  line-height: 1.7;
  flex: 1;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const HighlightText = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
`;

const TechStackSection = styled(motion.div)`
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(20px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 40px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary}, transparent);
  }

  @media (max-width: 768px) {
    padding: 28px;
  }
`;

const TechGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
  margin-top: 24px;

  @media (max-width: 768px) {
    gap: 20px;
  }
`;

const TechCategory = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-width: 240px;
  max-width: 280px;
`;

const CategoryTitle = styled.h4`
  font-family: 'JetBrains Mono', monospace;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.15rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: 0.01em;

  &::before {
    content: '▸';
    color: ${({ theme }) => theme.colors.primary};
    font-size: 1.3rem;
  }
`;

const TechList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const TechTag = styled.span`
  background: rgba(100, 255, 218, 0.1);
  color: ${({ theme }) => theme.colors.primary};
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
  border: 1px solid rgba(100, 255, 218, 0.3);
  transition: all 0.2s ease;
  letter-spacing: 0.02em;

  &:hover {
    background: rgba(100, 255, 218, 0.2);
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(100, 255, 218, 0.2);
  }
`;

const StatsBar = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 40px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 8px 24px rgba(100, 255, 218, 0.15);
    background: rgba(100, 255, 218, 0.05);
  }
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  font-family: 'JetBrains Mono', monospace;
  margin-bottom: 10px;
  letter-spacing: -0.02em;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
  opacity: 0.9;
`;

const techStack = {
  'Cloud & Infrastructure': ['AWS Lambda', 'S3', 'DynamoDB', 'Aurora', 'CloudFront', 'Cognito', 'CloudWatch'],
  'Backend & Languages': ['Go', 'Java', 'Node.js', 'Python', 'SQL', 'REST APIs'],
  'Frontend & Mobile': ['React', 'Flutter', 'JavaScript', 'HTML/CSS'],
  'Systems & DevOps': ['Linux', 'Arch', 'Bash', 'Docker', 'SystemD', 'Git'],
  'Android Development': ['AOSP', 'Custom ROMs', 'ADB', 'Java', 'Android SDK']
};

export default function About() {
  return (
    <AboutContainer id="about">
      <Header>
        <Title
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {'<About />'}
        </Title>
        <Subtitle
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Backend Engineer • Cloud Architect • Open Source Contributor
        </Subtitle>

        <StatsBar
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <StatCard whileHover={{ y: -4 }}>
            <StatNumber>10+</StatNumber>
            <StatLabel>Years Linux</StatLabel>
          </StatCard>
          <StatCard whileHover={{ y: -4 }}>
            <StatNumber>5+</StatNumber>
            <StatLabel>Years ROM Dev</StatLabel>
          </StatCard>
          <StatCard whileHover={{ y: -4 }}>
            <StatNumber>100+</StatNumber>
            <StatLabel>ROMs Released</StatLabel>
          </StatCard>
          <StatCard whileHover={{ y: -4 }}>
            <StatNumber>2017</StatNumber>
            <StatLabel>Started Coding</StatLabel>
          </StatCard>
        </StatsBar>
      </Header>

      <Layout>
        <Card
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <CardTitle>Current Role</CardTitle>
          <InfoGrid>
            <InfoRow>
              <InfoLabel>Position:</InfoLabel>
              <InfoValue><HighlightText>Backend Engineer</HighlightText></InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Focus:</InfoLabel>
              <InfoValue>Cloud infrastructure & serverless architecture</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Primary Stack:</InfoLabel>
              <InfoValue>Go, AWS (Lambda, DynamoDB, Aurora, S3, CloudFront, Cognito)</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Responsibilities:</InfoLabel>
              <InfoValue>Building scalable APIs, managing production cloud services, system architecture</InfoValue>
            </InfoRow>
          </InfoGrid>
        </Card>

        <Card
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <CardTitle>Background</CardTitle>
          <InfoGrid>
            <InfoRow>
              <InfoLabel>Experience:</InfoLabel>
              <InfoValue>Backend development, cloud engineering, system administration</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Specialization:</InfoLabel>
              <InfoValue><HighlightText>Serverless architecture</HighlightText>, API design, cloud-native development</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Open Source:</InfoLabel>
              <InfoValue>Active Android ROM developer, 100+ public releases, AOSP contributions</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Interests:</InfoLabel>
              <InfoValue>System architecture, automation, Linux internals, performance optimization</InfoValue>
            </InfoRow>
          </InfoGrid>
        </Card>
      </Layout>

      <FullWidthSection>
        <TechStackSection
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <CardTitle>Tech Stack</CardTitle>
          <TechGrid>
            {Object.entries(techStack).map(([category, technologies], index) => (
              <TechCategory key={index}>
                <CategoryTitle>{category}</CategoryTitle>
                <TechList>
                  {technologies.map((tech, techIndex) => (
                    <TechTag key={techIndex}>{tech}</TechTag>
                  ))}
                </TechList>
              </TechCategory>
            ))}
          </TechGrid>
        </TechStackSection>
      </FullWidthSection>
    </AboutContainer>
  );
}
