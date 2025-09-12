import { motion } from 'framer-motion';
import styled from 'styled-components';
import Badges from '../Badges';

const AchievementsContainer = styled.section`
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

  @media (max-width: 1024px) {
    padding: 60px 20px;
  }

  @media (max-width: 768px) {
    padding: 50px 15px;
  }

  @media (max-width: 480px) {
    padding: 40px 10px;
  }
`;

const IDE = styled(motion.div)`
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

  @media (max-width: 768px) {
    min-height: 500px;
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    min-height: 400px;
    border-radius: 6px;
  }
`;

const TabBar = styled.div`
  background: rgba(10, 25, 47, 0.7);
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Tab = styled.div`
  color: #64ffda;
  padding: 5px 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${({ $active }) => $active ? 'rgba(100, 255, 218, 0.1)' : 'transparent'};
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(100, 255, 218, 0.1);
  }

  i {
    font-size: 14px;
  }
`;

const StatusBar = styled.div`
  background: rgba(10, 25, 47, 0.7);
  padding: 5px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #64ffda;
  font-size: 0.8rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  .tech-stack {
    display: flex;
    align-items: center;
    gap: 15px;

    .tech {
      display: flex;
      align-items: center;
      gap: 5px;

      i {
        font-size: 14px;
      }
    }
  }
`;

const EditorContent = styled.div`
  padding: 20px;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const BadgeSection = styled.div`
  margin-bottom: 2rem;

  h2 {
    color: #64ffda;
    font-size: 1.2rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .github-stats {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    transition: all 0.3s ease;

    img {
      transition: all 0.3s ease;
      &:hover {
        transform: translateY(-5px);
        filter: drop-shadow(0 10px 30px rgba(2,12,27,0.7));
      }
    }

    @media (max-width: 768px) {
      img {
        width: 100%;
      }
    }
  }

  .badge-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1rem 0;

    svg {
      width: 100px;
      height: 100px;
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.1);
        filter: drop-shadow(0 0 10px rgba(189, 110, 82, 0.3));
      }
    }

    a {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-decoration: none;
    }

    .badge-text {
      margin-top: 0.5rem;
      text-align: center;
      color: #bd6e52;
      font-family: 'JetBrains Mono', monospace;

      .language {
        display: block;
        font-size: 1rem;
        font-weight: 600;
      }

      .level {
        display: block;
        font-size: 0.8rem;
        opacity: 0.8;
      }
    }
  }
`;

const ProfileViews = styled(motion.div)`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(14, 117, 182, 0.2);
  padding: 5px 10px;
  border-radius: 5px;
  border: 1px solid rgba(14, 117, 182, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;

  img {
    height: 20px;
  }

  @media (max-width: 768px) {
    position: relative;
    top: 0;
    right: 0;
    margin-bottom: 1rem;
    justify-content: center;
  }
`;

export default function Achievements() {
  return (
    <AchievementsContainer id="achievements">
      <IDE
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <TabBar>
          <Tab $active>
            <i className="fas fa-trophy"></i>
            achievements.jsx
          </Tab>
        </TabBar>
        <EditorContent>
          <ProfileViews
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <i className="fas fa-eye"></i>
            <img 
              src="https://komarev.com/ghpvc/?username=dragonemperor9480&color=0e75b6&style=flat" 
              alt="Profile views"
            />
          </ProfileViews>
          <BadgeSection>
            <h2>
              <i className="fab fa-github"></i>
              GitHub Statistics
            </h2>
            <motion.div 
              className="github-stats"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <img 
                src="https://github-readme-stats.vercel.app/api?username=DragonEmperor9480&show_icons=true&theme=gotham&hide_border=true&bg_color=0d1117&title_color=64ffda&icon_color=64ffda&text_color=ffffff" 
                alt="GitHub Stats"
                style={{ height: 'auto', maxWidth: '100%' }}
              />
              <img 
                src="https://github-readme-streak-stats.herokuapp.com?user=DragonEmperor9480&theme=gotham&hide_border=true&background=0d1117&ring=64ffda&fire=64ffda&currStreakLabel=64ffda"
                alt="GitHub Streak"
                style={{ height: 'auto', maxWidth: '100%' }}
              />
            </motion.div>
          </BadgeSection>

          <BadgeSection>
            <h2>
              <i className="fas fa-award"></i>
              SourceForge Achievements
            </h2>
            <Badges />
          </BadgeSection>

          <BadgeSection>
            <h2>
              <i className="fab fa-hackerrank"></i>
              HackerRank Achievements
            </h2>
            <div className="badge-container">
              <a href="https://www.hackerrank.com/profile/amruteshnaregal1" target="_blank" rel="noopener noreferrer">
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
                        <path className="star" fill="#bd6e52" d="M55.51425,77.01983l-1.89417-.275-.84833-1.7175a.299.299,0,0,0-.27167-.16917.3245.3245,0,0,0-.2725.16917l-.305.61833-.5425,1.09916-.51417.075-1.38.2a.30333.30333,0,0,0-.18583.10083.33411.33411,0,0,0-.045.06833.35631.35631,0,0,0-.02417.07667.34087.34087,0,0,0-.005.04083.3038.3038,0,0,0,.02417.13417.33341.33341,0,0,0,.06667.0975l1.37167,1.33667-.2875,1.67167-.03667.21417c-.00167.01-.00167.02-.0025.02917l-.00167.0175a.26453.26453,0,0,0,.00167.04417.30489.30489,0,0,0,.44417.22917l1.69417-.89,1.69416.89a.30352.30352,0,0,0,.44084-.32L54.31175,78.874l1.37083-1.33667a.30339.30339,0,0,0-.16833-.5175" transform="translate(-49.22548 -74.85817)"/>
                      </svg>
                    </g>
                  </g>
                </svg>
                <div className="badge-text">
                  <span className="language">C++</span>
                  <span className="level">Bronze level</span>
                </div>
              </a>
            </div>
          </BadgeSection>
        </EditorContent>
        <StatusBar>
          <div>
            <i className="fas fa-code-branch"></i> main
          </div>
          <div className="tech-stack">
            <div className="tech">
              <i className="fab fa-react"></i>
              React
            </div>
            <div className="tech">
              <i className="fab fa-js"></i>
              JavaScript
            </div>
          </div>
        </StatusBar>
      </IDE>
    </AchievementsContainer>
  );
} 