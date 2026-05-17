import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Container ────────────────────────────────────────────── */

const AboutContainer = styled.section`
  min-height: 100vh;
  width: 100%;
  position: relative;
  z-index: 1;
  padding: 120px 20px 80px;
  margin: 0 auto;
  max-width: 1200px;
  align-items: stretch;
  overflow-x: hidden;

  @media (max-width: 1024px) {
    padding: 100px 20px 60px;
  }

  @media (max-width: 768px) {
    padding: 80px 15px 50px;
  }

  @media (max-width: 480px) {
    padding: 70px 12px 40px;
  }
`;

/* ── Header ───────────────────────────────────────────────── */

const Header = styled.div`
  text-align: center;
  margin-bottom: 48px;

  @media (max-width: 768px) {
    margin-bottom: 36px;
  }
`;

const Title = styled(motion.h2)`
  font-size: 3.6rem;
  font-weight: 800;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #00ff88);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 14px;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 2.6rem;
  }

  @media (max-width: 480px) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.15rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 400;
  font-family: 'JetBrains Mono', monospace;
  opacity: 0.7;
  line-height: 1.6;
  max-width: 560px;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

/* ── Main Glass Card (single container) ───────────────────── */

const MainCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(20px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  overflow: hidden;
  position: relative;

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
`;

/* ── Narrative Section ────────────────────────────────────── */

const NarrativeSection = styled.div`
  padding: 44px 48px 40px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 768px) {
    padding: 32px 24px 28px;
  }

  @media (max-width: 480px) {
    padding: 24px 18px 22px;
  }
`;

const SectionLabel = styled.h3`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text};
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: -0.01em;

  &::before {
    content: '//';
    color: ${({ theme }) => theme.colors.primary};
    opacity: 0.8;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const Narrative = styled(motion.p)`
  font-size: 1.1rem;
  line-height: 1.85;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.85;
  font-weight: 400;
  max-width: 800px;

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.75;
  }
`;

const HighlightText = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
`;

/* ── Tech Stack (Tabbed) ──────────────────────────────────── */

const TechSection = styled.div`
  padding: 40px 48px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 768px) {
    padding: 28px 24px;
  }

  @media (max-width: 480px) {
    padding: 22px 18px;
  }
`;

const TabRow = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 16px;
  margin-bottom: 28px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-bottom: 4px;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    gap: 4px;
    margin-bottom: 20px;
    /* hint at scrollability */
    mask-image: linear-gradient(to right, black 90%, transparent 100%);
    -webkit-mask-image: linear-gradient(to right, black 90%, transparent 100%);
  }
`;

const Tab = styled.button`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  padding: 8px 18px;
  border-radius: 8px;
  border: 1px solid ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.border};
  background: ${({ $active, theme }) =>
    $active ? `${theme.colors.primary}18` : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.text};
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.25s ease;
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => `${theme.colors.primary}12`};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: 480px) {
    font-size: 0.78rem;
    padding: 7px 14px;
  }
`;

const TagContainer = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  min-height: 44px;
`;

const TechTag = styled(motion.span)`
  background: rgba(100, 255, 218, 0.08);
  color: ${({ theme }) => theme.colors.primary};
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.92rem;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
  border: 1px solid rgba(100, 255, 218, 0.2);
  transition: all 0.2s ease;
  letter-spacing: 0.02em;

  &:hover {
    background: rgba(100, 255, 218, 0.18);
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(100, 255, 218, 0.15);
  }

  @media (max-width: 480px) {
    font-size: 0.82rem;
    padding: 6px 12px;
  }
`;

/* ── Stats Accent Row ─────────────────────────────────────── */

const StatsRow = styled.div`
  padding: 24px 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    padding: 20px 24px;
    gap: 8px;
  }

  @media (max-width: 480px) {
    padding: 18px;
    gap: 6px;
  }
`;

const StatItem = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.88rem;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.6;
  font-weight: 500;
  white-space: nowrap;
  letter-spacing: 0.01em;

  strong {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 700;
    opacity: 1;
  }

  @media (max-width: 480px) {
    font-size: 0.78rem;
  }
`;

const Dot = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  opacity: 0.4;
  font-size: 0.6rem;
  user-select: none;

  @media (max-width: 480px) {
    font-size: 0.5rem;
  }
`;

/* ── Data ─────────────────────────────────────────────────── */

const techStack = {
  'Cloud & Infra': ['AWS Lambda', 'S3', 'DynamoDB', 'Aurora', 'CloudFront', 'Cognito', 'CloudWatch'],
  'Backend': ['Go', 'Java', 'Node.js', 'Python', 'SQL', 'REST APIs'],
  'Frontend': ['React', 'Flutter', 'JavaScript', 'HTML/CSS'],
  'Systems & DevOps': ['Linux', 'Arch', 'Bash', 'Docker', 'SystemD', 'Git'],
  'Android': ['AOSP', 'Custom ROMs', 'ADB', 'Java', 'Android SDK'],
};

const categories = Object.keys(techStack);

const stats = [
  { value: '10+', label: 'yrs Linux' },
  { value: '5+', label: 'yrs ROM Dev' },
  { value: '100+', label: 'ROMs Released' },
  { value: '2017', label: 'Started Coding' },
];

/* ── Component ────────────────────────────────────────────── */

export default function About() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <AboutContainer id="about">
      {/* ── Header ── */}
      <Header>
        <Title
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {'<About />'}
        </Title>
        <Subtitle
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          viewport={{ once: true }}
        >
          Backend Engineer · Cloud-Native Builder · Open Source Contributor
        </Subtitle>
      </Header>

      {/* ── Single Glass Card ── */}
      <MainCard
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        {/* Narrative */}
        <NarrativeSection>
          <SectionLabel>Who I Am</SectionLabel>
          <Narrative
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            I'm a <HighlightText>backend engineer</HighlightText> focused on
            cloud-native infrastructure — building serverless APIs
            with <HighlightText>Go</HighlightText> and <HighlightText>AWS</HighlightText>.
            Outside of work, I maintain custom Android ROMs
            with <HighlightText>100+ public releases</HighlightText> and
            contribute to AOSP. I've been running Linux for over a decade
            and love diving deep into systems architecture and performance
            optimization.
          </Narrative>
        </NarrativeSection>

        {/* Tech Stack — Tabbed */}
        <TechSection>
          <SectionLabel>Tech Stack</SectionLabel>
          <TabRow>
            {categories.map((cat, i) => (
              <Tab
                key={cat}
                $active={activeTab === i}
                onClick={() => setActiveTab(i)}
              >
                {cat}
              </Tab>
            ))}
          </TabRow>

          <AnimatePresence mode="wait">
            <TagContainer
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
              {techStack[categories[activeTab]].map((tech, idx) => (
                <TechTag
                  key={tech}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: idx * 0.04 }}
                >
                  {tech}
                </TechTag>
              ))}
            </TagContainer>
          </AnimatePresence>
        </TechSection>

        {/* Stats Accent Row */}
        <StatsRow>
          {stats.map((stat, i) => (
            <span key={i} style={{ display: 'contents' }}>
              <StatItem>
                <strong>{stat.value}</strong> {stat.label}
              </StatItem>
              {i < stats.length - 1 && <Dot>●</Dot>}
            </span>
          ))}
        </StatsRow>
      </MainCard>
    </AboutContainer>
  );
}
