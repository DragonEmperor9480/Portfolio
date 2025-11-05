import { motion } from 'framer-motion';
import styled from 'styled-components';
import Badges from '../Badges';

const AchievementsContainer = styled.section`
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

const StatsBar = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 28px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 8px 24px rgba(100, 255, 218, 0.15);
    background: rgba(100, 255, 218, 0.05);
  }
`;

const StatIcon = styled.div`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 16px;
`;

const StatLabel = styled.div`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
  margin-bottom: 6px;
  font-family: 'Fira Code', monospace;
  letter-spacing: 0.02em;
`;

const StatDesc = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-family: 'IBM Plex Mono', monospace;
`;

const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
`;

const AchievementSection = styled(motion.div)`
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

const SectionTitle = styled.h3`
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

  i {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 1.3rem;
  }
`;

const GitHubStatsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  img {
    width: 100%;
    height: auto;
    border-radius: 12px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(100, 255, 218, 0.15);
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const ProfileViewsCard = styled.div`
  background: rgba(100, 255, 218, 0.05);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  margin-bottom: 28px;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: rgba(100, 255, 218, 0.08);
  }

  .views-label {
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.1rem;
    margin-bottom: 12px;
    font-family: 'Fira Code', monospace;
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  img {
    height: 28px;
  }
`;

const BadgesContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  padding: 20px;
`;

const HackerRankContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;

  .badge-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    transition: all 0.3s ease;
    padding: 20px;
    border-radius: 16px;
    border: 1px solid transparent;

    &:hover {
      transform: translateY(-8px);
      border-color: ${({ theme }) => theme.colors.border};
      background: rgba(189, 110, 82, 0.05);
    }

    svg {
      width: 140px;
      height: 140px;
      margin-bottom: 20px;
      filter: drop-shadow(0 4px 12px rgba(189, 110, 82, 0.2));
      transition: all 0.3s ease;

      &:hover {
        filter: drop-shadow(0 8px 24px rgba(189, 110, 82, 0.4));
      }
    }

    .badge-info {
      text-align: center;

      .language {
        display: block;
        font-size: 1.3rem;
        font-weight: 700;
        color: ${({ theme }) => theme.colors.text};
        font-family: 'Fira Code', monospace;
        margin-bottom: 6px;
        letter-spacing: 0.03em;
      }

      .level {
        display: block;
        font-size: 1rem;
        color: #bd6e52;
        font-weight: 600;
        font-family: 'IBM Plex Mono', monospace;
      }
    }
  }
`;

export default function Achievements() {
  return (
    <AchievementsContainer id="achievements">
      <Header>
        <Title
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {'<Achievements />'}
        </Title>
        <Subtitle
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Open Source • Coding Challenges • Community Recognition
        </Subtitle>

        <StatsBar
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <StatCard whileHover={{ y: -4 }}>
            <StatIcon>
              <i className="fab fa-github"></i>
            </StatIcon>
            <StatLabel>GitHub</StatLabel>
            <StatDesc>Open Source Projects</StatDesc>
          </StatCard>
          <StatCard whileHover={{ y: -4 }}>
            <StatIcon>
              <i className="fas fa-download"></i>
            </StatIcon>
            <StatLabel>SourceForge</StatLabel>
            <StatDesc>ROM Downloads</StatDesc>
          </StatCard>
          <StatCard whileHover={{ y: -4 }}>
            <StatIcon>
              <i className="fas fa-code"></i>
            </StatIcon>
            <StatLabel>HackerRank</StatLabel>
            <StatDesc>Coding Challenges</StatDesc>
          </StatCard>
        </StatsBar>
      </Header>

      <AchievementsGrid>
        <AchievementSection
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <SectionTitle>
            <i className="fab fa-github"></i>
            GitHub Statistics
          </SectionTitle>
          
          <ProfileViewsCard>
            <div className="views-label">PROFILE VIEWS</div>
            <img 
              src="https://komarev.com/ghpvc/?username=dragonemperor9480&color=0e75b6&style=flat" 
              alt="Profile views"
            />
          </ProfileViewsCard>

          <GitHubStatsContainer>
            <img 
              src="https://github-readme-stats.vercel.app/api?username=DragonEmperor9480&show_icons=true&theme=gotham&hide_border=true&bg_color=0d1117&title_color=64ffda&icon_color=64ffda&text_color=ffffff" 
              alt="GitHub Stats"
            />
            <img 
              src="https://github-readme-streak-stats.herokuapp.com?user=DragonEmperor9480&theme=gotham&hide_border=true&background=0d1117&ring=64ffda&fire=64ffda&currStreakLabel=64ffda"
              alt="GitHub Streak"
            />
          </GitHubStatsContainer>
        </AchievementSection>

        <AchievementSection
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <SectionTitle>
            <i className="fas fa-award"></i>
            SourceForge Recognition
          </SectionTitle>
          
          <ProfileViewsCard>
            <div className="views-label">ROM DOWNLOADS</div>
            <a 
              href="https://sourceforge.net/projects/dragon-emperor-builds/files/latest/download"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img 
                alt="Download Dragon Emperor builds" 
                src="https://img.shields.io/sourceforge/dt/dragon-emperor-builds.svg?style=flat&color=64ffda&labelColor=0a192f"
                style={{ height: '28px' }}
              />
            </a>
          </ProfileViewsCard>

          <BadgesContainer>
            <Badges />
          </BadgesContainer>
        </AchievementSection>

        <AchievementSection
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <SectionTitle>
            <i className="fab fa-hackerrank"></i>
            HackerRank Achievements
          </SectionTitle>
          <HackerRankContainer>
            <a 
              href="https://www.hackerrank.com/profile/amruteshnaregal1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="badge-link"
            >
              <svg viewBox="0 0 105 105" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <defs>
                  <linearGradient id="badge-bronze-gradient" x1="52.5" y1="2.5" x2="52.5" y2="102.5" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#ffc5ab"/>
                    <stop offset="1" stopColor="#ffa38a"/>
                  </linearGradient>
                </defs>
                <g>
                  <path fill="url(#badge-bronze-gradient)" d="M90.3892 44.9106L90.3893 44.914C90.5873 51.9976 90.3892 59.5788 89.8948 65.4581L89.8947 65.4581L89.894 65.4684C89.7459 67.8071 89.5241 69.8644 89.2548 71.4803C88.9812 73.1224 88.6689 74.2376 88.3726 74.7495L88.3684 74.7569L88.3644 74.7644C88.2249 75.0255 87.9549 75.366 87.5388 75.7853C87.1279 76.1994 86.5969 76.6683 85.9594 77.1872C84.6848 78.2247 83.011 79.4407 81.0792 80.7886C76.1371 84.1752 69.4065 88.1657 62.9661 91.6605L62.9645 91.6614C58.9514 93.8584 55.1183 95.8269 51.996 97.2447C50.4343 97.9539 49.0577 98.522 47.9293 98.9118C46.7841 99.3074 45.9476 99.5 45.4429 99.5C44.8368 99.5 43.7518 99.219 42.2485 98.6583C40.7685 98.1063 38.9475 97.3088 36.9015 96.3316C32.811 94.3779 27.849 91.7188 22.9696 88.9044C18.0901 86.09 13.3015 83.125 9.55688 80.5609C7.68397 79.2784 6.07847 78.1005 4.85537 77.0948C3.6188 76.0781 2.82774 75.2805 2.51554 74.7536C2.28519 74.3275 2.0493 73.5182 1.82917 72.3438C1.61115 71.1807 1.41751 69.7122 1.25082 68.0137C0.917563 64.6178 0.694767 60.3313 0.595718 55.7891L0.595639 55.7862C0.39748 48.597 0.496929 40.7167 0.991039 34.7412L0.991144 34.7412L0.991781 34.7309C1.13992 32.3423 1.36172 30.2598 1.63112 28.6185C1.90193 26.9685 2.21232 25.8224 2.51467 25.2483C2.86854 24.6758 3.67611 23.8504 4.9172 22.8226C6.15287 21.7992 7.77552 20.6094 9.70207 19.315L9.70402 19.3137C14.5518 16.0235 21.0868 12.0319 27.3246 8.63924L27.3247 8.63927L27.3296 8.63653C31.4393 6.34112 35.4202 4.29812 38.6657 2.83059C40.2891 2.09658 41.7217 1.5096 42.8908 1.10715C44.0779 0.698497 44.9386 0.5 45.4429 0.5C45.8599 0.5 46.5131 0.630344 47.3938 0.904038C48.2627 1.17405 49.3131 1.57058 50.508 2.07336C52.8947 3.07763 55.8302 4.49415 58.9957 6.13884L76.0424 15.9271C79.2093 17.9719 82.072 19.9123 84.2641 21.5505C85.3617 22.3708 86.285 23.1108 86.9918 23.7467C87.708 24.391 88.1652 24.8965 88.372 25.2495C88.6251 25.6975 88.8797 26.5434 89.1143 27.7675C89.346 28.9765 89.5489 30.5006 89.7217 32.2614C90.0674 35.7817 90.2902 40.2179 90.3892 44.9106Z" stroke="#bd6e52"/>
                  <g transform="translate(39, 22)">
                    <image xlinkHref="https://hrcdn.net/fcore/assets/badges/cpp-739b350881.svg" width="27" height="27"/>
                  </g>
                  <text x="52.5" y="67" fontSize="10" textAnchor="middle" dominantBaseline="middle" fill="#bd6e52">CPP</text>
                  <g transform="translate(44, 71)">
                    <svg height="10">
                      <path className="star" fill="#bd6e52" d="M55.51425,77.01983l-1.89417-.275-.84833-1.7175a.299.299,0,0,0-.27167-.16917.3245.3245,0,0,0-.2725.16917l-.305.61833-.5425,1.09916-.51417.075-1.38.2a.30333.30333,0,0,0-.18583.10083.33411.33411,0,0,0-.045.06833.35631.35631,0,0,0-.02417.07667.34087.34087,0,0,0-.005.04083.3038.3038,0,0,0,.02417.13417.33341.33341,0,0,0,.06667.0975l1.37167,1.33667-.2875,1.67167-.03667.21417c-.00167.01-.00167.02-.0025.02917l-.00167.0175a.26453.26453,0,0,0,.00167.04417.30489.30489,0,0,0,.44417.22917l1.69417-.89,1.69416.89a.30352.30352,0,0,0,.44084-.32L54.31175,78.874l1.37083-1.33667a.30339.30339,0,0,0-.16833-.5175" transform="translate(-49.22548 -74.85817)"/>
                    </svg>
                    <svg height="10" x="9">
                      <path className="star" fill="#bd6e52" d="M55.51425,77.01983l-1.89417-.275-.84833-1.7175a.299.299,0,0,0-.27167-.16917.3245.3245,0,0,0-.2725.16917l-.305.61833-.5425,1.09916-.51417.075-1.38.2a.30333.30333,0,0,0-.18583.10083.33411.33411,0,0,0-.045.06833.35631.35631,0,0,0-.02417.07667.34087.34087,0,0,0-.005.04083.3038.3038,0,0,0-.02417.13417.33341.33341,0,0,0,.06667.0975l1.37167,1.33667-.2875,1.67167-.03667.21417c-.00167.01-.00167.02-.0025.02917l-.00167.0175a.26453.26453,0,0,0,.00167.04417.30489.30489,0,0,0,.44417.22917l1.69417-.89,1.69416.89a.30352.30352,0,0,0,.44084-.32L54.31175,78.874l1.37083-1.33667a.30339.30339,0,0,0-.16833-.5175" transform="translate(-49.22548 -74.85817)"/>
                    </svg>
                  </g>
                </g>
              </svg>
              <div className="badge-info">
                <span className="language">C++</span>
                <span className="level">Bronze Level</span>
              </div>
            </a>
          </HackerRankContainer>
        </AchievementSection>
      </AchievementsGrid>
    </AchievementsContainer>
  );
}
