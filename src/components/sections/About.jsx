'use client';

import { useState } from 'react';
import styled, { useTheme as useStyledTheme } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import skillsData from '../../data/skills.json';

/* ── Container & Global Elements ─────────────────────────── */

const AboutContainer = styled.section`
  min-height: 100vh;
  width: 100%;
  position: relative;
  z-index: 1;
  padding: 120px 20px 80px;
  margin: 0 auto;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 100px 16px 60px;
    min-height: auto;
  }
`;

const GridOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(${({ theme }) => theme.colors.border} 1px, transparent 1px),
                    linear-gradient(90deg, ${({ theme }) => theme.colors.border} 1px, transparent 1px);
  background-size: 30px 30px;
  pointer-events: none;
  opacity: 0.8;
  z-index: 0;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 48px;
  z-index: 1;

  @media (max-width: 768px) {
    margin-bottom: 36px;
  }
`;

const Title = styled(motion.h2)`
  font-size: 2.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #00ff88);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 0.06em;
  text-transform: uppercase;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.05rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-family: 'Rajdhani', sans-serif;
  opacity: 0.85;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

/* ── Carousel Elements ────────────────────────────────────── */

const CarouselWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  width: 100%;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const ArrowButton = styled(motion.button)`
  background: ${props => props.theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$color || props.theme.colors.text};
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.25s ease;
  padding: 0;

  &:hover {
    border-color: ${props => props.$color};
    background: ${props => props.$color}08;
    box-shadow: 0 0 15px ${props => props.$color}25;
  }

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 600px) {
    width: 40px;
    height: 40px;
    
    svg {
      width: 16px;
      height: 16px;
    }
  }

  @media (max-width: 400px) {
    width: 32px;
    height: 32px;
    
    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const CardViewport = styled.div`
  flex: 1;
  max-width: 780px;
  position: relative;
  overflow: hidden;
  min-height: 420px;
  display: flex;
  align-items: stretch;
  border-radius: 16px;

  @media (max-width: 768px) {
    min-height: 520px;
  }

  @media (max-width: 480px) {
    min-height: 460px;
  }
`;

const CategoryCard = styled(motion.div)`
  width: 100%;
  background: ${({ theme }) => theme.colors.glass || 'rgba(15, 15, 25, 0.35)'};
  backdrop-filter: blur(20px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 36px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.35),
              0 0 30px ${props => props.$color}05;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 24px;
  }

  @media (max-width: 480px) {
    padding: 18px 14px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 14px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    padding-bottom: 10px;
  }
`;

const CategoryTitle = styled.h3`
  font-family: 'Orbitron', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  letter-spacing: 0.04em;

  @media (max-width: 600px) {
    font-size: 1.2rem;
  }

  @media (max-width: 400px) {
    font-size: 1rem;
  }
`;

const CardIndex = styled.span`
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  color: ${props => props.$color};
  font-weight: 600;

  @media (max-width: 400px) {
    font-size: 0.75rem;
  }
`;

const CategoryDescription = styled.p`
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.05rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 28px 0;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  margin-top: auto;

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
  }
`;

const SkillCard = styled(motion.div)`
  background: ${props => props.theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.015)'};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 16px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 6px;
  cursor: default;
  transition: border-color 0.25s ease, background-color 0.25s ease;

  &:hover {
    border-color: ${props => props.$color}40;
    background: ${props => props.theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.035)'};

    .glow-bar {
      width: 100%;
    }
  }
`;

const SkillCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const SkillName = styled.span`
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  font-size: 1.05rem;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: 0.02em;
`;

const SkillInfo = styled.span`
  font-family: 'Fira Code', monospace;
  font-size: 0.65rem;
  color: ${props => props.$color};
  opacity: 0.85;
`;

const SkillLevelBarContainer = styled.div`
  width: 100%;
  height: 2.5px;
  background: ${props => props.theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.05)'};
  border-radius: 2px;
  overflow: hidden;
  margin-top: 4px;
`;

const SkillLevelBar = styled.div`
  height: 100%;
  width: 100%;
  background: ${props => props.$color};
  box-shadow: 0 0 6px ${props => props.$color};
`;

const GlowBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 0;
  background: ${props => props.$color};
  box-shadow: 0 0 8px ${props => props.$color};
  transition: width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
`;

const IndicatorContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 32px;
  z-index: 2;
`;

const IndicatorDot = styled.button`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: ${props => props.$active ? props.$color : (props.theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.18)' : 'rgba(255, 255, 255, 0.18)')};
  box-shadow: ${props => props.$active ? `0 0 8px ${props.$color}` : 'none'};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0;

  &:hover {
    background: ${props => props.$color};
    opacity: 0.8;
  }
`;

/* ── Helper Data & Logic ────────────────────────────────── */



const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 80 : -80,
    opacity: 0
  })
};

/* ── Main Component ───────────────────────────────────────── */

export default function About() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(0);

  const categories = Object.keys(skillsData || {});
  const currentCategory = categories[activeIdx] || categories[0] || '';
  const currentCategoryData = skillsData?.[currentCategory] || { description: '', color: '', skills: [] };
  const currentSkills = currentCategoryData.skills || [];

  const styledTheme = useStyledTheme();
  const isLight = styledTheme?.name === 'Light Mode';

  const getCategoryColor = (categoryKey) => {
    const rawColor = skillsData[categoryKey]?.color || '#64ffda';
    if (isLight) {
      switch (categoryKey) {
        case 'Cloud Infrastructure': return '#0284c7';
        case 'Backend Engineering': return '#ea580c';
        case 'Frontend Development': return '#0d9488';
        case 'Systems & DevOps': return '#7c3aed';
        case 'Android & AOSP ROMs': return '#65a30d';
        default: return '#0d9488';
      }
    }
    return rawColor;
  };

  const catColor = getCategoryColor(currentCategory);

  const handleNext = () => {
    setDirection(1);
    setActiveIdx((prev) => (prev + 1) % categories.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIdx((prev) => (prev - 1 + categories.length) % categories.length);
  };

  return (
    <AboutContainer id="about">
      <GridOverlay />

      {/* ── Header ── */}
      <Header>
        <Title
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Skills & Expertise
        </Title>
        <Subtitle
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          viewport={{ once: true }}
        >
          A curated view of technical proficiencies and specialized operational disciplines.
        </Subtitle>
      </Header>

      {/* ── Slider Carousel ── */}
      <CarouselWrapper>
        <ArrowButton 
          onClick={handlePrev} 
          $color={catColor}
          whileTap={{ scale: 0.95 }}
          aria-label="Previous skill category"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </ArrowButton>

        <CardViewport>
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <CategoryCard
              key={activeIdx}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 350, damping: 32 },
                opacity: { duration: 0.2 }
              }}
              $color={catColor}
            >
              <CardHeader>
                <CategoryTitle>{currentCategory}</CategoryTitle>
                <CardIndex $color={catColor}>
                  0{activeIdx + 1} / 0{categories.length}
                </CardIndex>
              </CardHeader>

              <CategoryDescription>
                {currentCategoryData.description}
              </CategoryDescription>

              <SkillsGrid>
                {currentSkills.map((skill) => {
                  return (
                    <SkillCard
                      key={skill.name}
                      $color={catColor}
                      whileHover={{ y: -3 }}
                    >
                      <SkillCardHeader>
                        <SkillName>{skill.name}</SkillName>
                        <SkillInfo $color={catColor}>{skill.info || 'Active'}</SkillInfo>
                      </SkillCardHeader>
                      <SkillLevelBarContainer>
                        <SkillLevelBar $color={catColor} />
                      </SkillLevelBarContainer>
                      <GlowBar className="glow-bar" $color={catColor} />
                    </SkillCard>
                  );
                })}
              </SkillsGrid>
            </CategoryCard>
          </AnimatePresence>
        </CardViewport>

        <ArrowButton 
          onClick={handleNext} 
          $color={catColor}
          whileTap={{ scale: 0.95 }}
          aria-label="Next skill category"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </ArrowButton>
      </CarouselWrapper>

      {/* ── Indicators ── */}
      <IndicatorContainer>
        {categories.map((_, idx) => (
          <IndicatorDot
            key={idx}
            $active={idx === activeIdx}
            $color={catColor}
            onClick={() => {
              setDirection(idx > activeIdx ? 1 : -1);
              setActiveIdx(idx);
            }}
            aria-label={`Go to skill category ${idx + 1}`}
          />
        ))}
      </IndicatorContainer>
    </AboutContainer>
  );
}
