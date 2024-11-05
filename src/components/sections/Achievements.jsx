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
  background: ${({ active }) => active ? 'rgba(100, 255, 218, 0.1)' : 'transparent'};
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
`;

const EditorContent = styled.div`
  padding: 20px;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
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

    @media (max-width: 768px) {
      img {
        width: 100%;
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
          <Tab active>
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
                src="https://github-readme-stats.vercel.app/api?username=DragonEmperor9480&show_icons=true&theme=tokyonight&hide_border=true" 
                alt="GitHub Stats"
                style={{ height: 'auto', maxWidth: '100%' }}
              />
              <img 
                src="https://github-readme-streak-stats.herokuapp.com?user=DragonEmperor9480&theme=gotham"
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
        </EditorContent>
        <StatusBar>
          <div>
            <i className="fas fa-code-branch"></i> main
          </div>
          <div>JavaScript React</div>
        </StatusBar>
      </IDE>
    </AchievementsContainer>
  );
} 