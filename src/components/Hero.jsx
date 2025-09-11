import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import profileImage from '../assets/profile.jpg';

const HeroContainer = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  position: relative;
  z-index: 1;
  padding-top: 70px;
  margin: 0 auto;
  max-width: 1280px;
`;

const GlassCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(10px);
  border-radius: 20px;
  width: 95%;
  max-width: 1200px;
  height: auto;
  min-height: 650px;
  display: flex;
  margin-top: 5rem;
  position: relative;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);

  @media (max-width: 768px) {
    margin-top: 2rem;
    min-height: auto;
  }
`;

const TitleBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  padding: 0 15px;
  color: ${({ theme }) => theme.colors.primary};
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;



const WindowControls = styled.div`
  display: flex;
  gap: 8px;
`;

const WindowButton = styled(motion.div)`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.5);
  opacity: 0.8;
  transition: all 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  margin-top: 40px;
  background: transparent;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    margin-top: 20px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    margin-top: 80px;
  }
`;

const RightSection = styled.div`
  flex: 1.2;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 1.5rem;
    text-align: center;
  }
`;

const ProfileImage = styled(motion.img)`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  border: 3px solid ${({ theme }) => `${theme.colors.primary}50`};
  padding: 5px;
  box-shadow: 0 0 30px ${({ theme }) => `${theme.colors.primary}20`};
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    width: 200px;
    height: 200px;
  }

  @media (max-width: 480px) {
    width: 150px;
    height: 150px;
  }
`;

const Name = styled(motion.h1)`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 10px;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const TypewriterContainer = styled.div`
  font-size: 2rem;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.9;
  margin-bottom: 20px;
  font-weight: 500;

  .cursor {
    color: ${({ theme }) => theme.colors.primary};
    animation: blink 1s step-start infinite;
    margin-left: 2px;
  }

  @keyframes blink {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const Bio = styled(motion.p)`
  font-size: 1.2rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.8;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin: 1.5rem 0;
  }
`;

const SocialLinks = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    justify-items: center;
    gap: 0.8rem;
  }
`;

const SocialLink = styled(motion.a)`
  height: 50px;
  width: 220px;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5rem;
  border-radius: 25px;
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(5px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  text-decoration: none;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  .icon {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }

  .platform-name {
    font-size: 0.9rem;
    font-family: 'JetBrains Mono', monospace;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: absolute;
    left: 55px;
  }

  .username {
    font-size: 0.85rem;
    font-family: 'JetBrains Mono', monospace;
    position: absolute;
    left: 55px;
    opacity: 0;
    transform: translateX(-20px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @media (hover: hover) {
    &:hover {
      background: ${({ theme }) => `${theme.colors.primary}20`};
      box-shadow: 0 0 20px ${({ theme }) => `${theme.colors.primary}30`};
      width: 280px;
      transform: translateX(5px);

      .username {
        opacity: 1;
        transform: translateX(0);
      }

      .platform-name {
        opacity: 0;
        transform: translateX(20px);
      }
    }
  }

  @media (hover: none) {
    &:active {
      background: ${({ theme }) => `${theme.colors.primary}20`};
      box-shadow: 0 0 20px ${({ theme }) => `${theme.colors.primary}30`};
      width: 280px;
      transform: translateX(5px);

      .username {
        opacity: 1;
        transform: translateX(0);
      }

      .platform-name {
        opacity: 0;
        transform: translateX(20px);
      }
    }
  }
  
  @media (max-width: 768px) {
    width: 200px;
    
    &:hover, &:active {
      width: 250px;
    }
  }
`;

const roles = [
  "Cloud Engineer",
  "Backend Developer",
  "ROM Developer",
  "Linux Enthusiast",
  "Tech Explorer"
];

export default function Hero() {
  const [text, setText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (text.length < currentRole.length) {
          setText(currentRole.slice(0, text.length + 1));
          setTimeout(() => { }, 75);
        } else {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        if (text.length > 0) {
          setText(currentRole.slice(0, text.length - 1));
          setTimeout(() => { }, 40);
        } else {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
          setTimeout(() => { }, 150);
        }
      }
    }, isDeleting ? 40 : 75);

    return () => clearTimeout(timeout);
  }, [text, roleIndex, isDeleting]);

  return (
    <HeroContainer id="home">
      <GlassCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <TitleBar>
          <span>amrutesh@portfolio:~$</span>
          <WindowControls>
            <WindowButton
              color="#ff5f56"
              title="close"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              ×
            </WindowButton>
            <WindowButton
              color="#ffbd2e"
              title="minimize"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              −
            </WindowButton>
            <WindowButton
              color="#27c93f"
              title="maximize"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              +
            </WindowButton>
          </WindowControls>
        </TitleBar>

        <ContentWrapper>
          <LeftSection>
            <ProfileImage
              src={profileImage}
              alt="Amrutesh Naregal"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              draggable="false"
            />
          </LeftSection>

          <RightSection>
            <Name
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Amrutesh Naregal
            </Name>

            <TypewriterContainer>
              <motion.span>{text}</motion.span>
              <span className="cursor">|</span>
            </TypewriterContainer>

            <Bio
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Just a guy who likes to code and build things. Loves to Tinker with Android. Gamer4life. Arch Linux User.
            </Bio>

            <SocialLinks
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <SocialLink
                href="https://github.com/DragonEmperor9480"
                target="_blank"
                rel="noopener noreferrer"
                whileTap={{ scale: 0.95 }}
              >
                <span className="icon">
                  <i className="fab fa-github"></i>
                </span>
                <span className="platform-name">GitHub</span>
                <span className="username">DragonEmperor9480</span>
              </SocialLink>

              <SocialLink
                href="https://www.linkedin.com/in/amrutesh-naregal"
                target="_blank"
                rel="noopener noreferrer"
                whileTap={{ scale: 0.95 }}
              >
                <span className="icon">
                  <i className="fab fa-linkedin-in"></i>
                </span>
                <span className="platform-name">LinkedIn</span>
                <span className="username">amrutesh-naregal</span>
              </SocialLink>

              <SocialLink
                href="mailto:amruteshnaregal1234@gmail.com"
                whileTap={{ scale: 0.95 }}
              >
                <span className="icon">
                  <i className="fas fa-envelope"></i>
                </span>
                <span className="platform-name">Email</span>
                <span className="username">amruteshnaregal1234@gmail.com</span>
              </SocialLink>

              <SocialLink
                href="https://t.me/Kamisato_Amrut"
                target="_blank"
                rel="noopener noreferrer"
                whileTap={{ scale: 0.95 }}
              >
                <span className="icon">
                  <i className="fab fa-telegram-plane"></i>
                </span>
                <span className="platform-name">Telegram</span>
                <span className="username">@Kamisato_Amrut</span>
              </SocialLink>
            </SocialLinks>
          </RightSection>
        </ContentWrapper>
      </GlassCard>
    </HeroContainer>
  );
}
