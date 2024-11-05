import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useEffect } from 'react';

const BadgesContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const BadgesRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    justify-content: center;
  }

  .sf-root {
    margin: 0.25rem;
  }
`;

export default function Badges() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://b.sf-syn.com/badge_js?sf_id=3664573';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <BadgesContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <BadgesRow>
        <div className="sf-root" data-id="3664573" data-badge="oss-users-love-us-white" style={{width:"125px"}}>
          <a href="https://sourceforge.net/projects/dragon-emperor-builds/" target="_blank" rel="noopener noreferrer">
            Dragon Emperor builds
          </a>
        </div>
        <div className="sf-root" data-id="3664573" data-badge="oss-rising-star-white" data-metadata="achievement=oss-rising-star" style={{width:"125px"}}>
          <a href="https://sourceforge.net/projects/dragon-emperor-builds/" target="_blank" rel="noopener noreferrer">
            Dragon Emperor builds
          </a>
        </div>
        <div className="sf-root" data-id="3664573" data-badge="oss-community-choice-white" data-metadata="achievement=oss-community-choice" style={{width:"125px"}}>
          <a href="https://sourceforge.net/projects/dragon-emperor-builds/" target="_blank" rel="noopener noreferrer">
            Dragon Emperor builds
          </a>
        </div>
        <div className="sf-root" data-id="3664573" data-badge="oss-sf-favorite-white" data-metadata="achievement=oss-sf-favorite" style={{width:"125px"}}>
          <a href="https://sourceforge.net/projects/dragon-emperor-builds/" target="_blank" rel="noopener noreferrer">
            Dragon Emperor builds
          </a>
        </div>
      </BadgesRow>
    </BadgesContainer>
  );
} 