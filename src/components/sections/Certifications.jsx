import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import certificates from '../../data/certificates.json';

const CertificationsContainer = styled.section`
  width: 100%;
  max-width: 1280px;
  padding: 2rem;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  align-items: center;
`;

const KDEWindow = styled(motion.div)`
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(10px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  width: 100%;
  min-height: 600px;
`;

const WindowHeader = styled.div`
  background: ${({ theme }) => theme.colors.background};
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const WindowButton = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
`;

const WindowTitle = styled.div`
  margin-left: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  font-family: 'JetBrains Mono', monospace;
`;

const CertGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  padding: 2rem;
  gap: 1.5rem;
  background: ${({ theme }) => theme.colors.background};
  min-height: calc(100% - 56px);
  position: relative;
  overflow: hidden;
`;

const CertCard = styled(motion.a)`
  position: relative;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.glass};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  transform-origin: center;
  height: fit-content;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    transform: scale(1.15);
    z-index: 50;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 10px 30px -10px ${({ theme }) => `${theme.colors.primary}30`};

    .cert-info {
      transform: translateY(100%);
      opacity: 0;
    }

    .view-button {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CertContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const CertImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 4/3;
  background: ${({ theme }) => theme.colors.background};
  padding: 0.75rem;
  border-radius: 8px;
  overflow: hidden;
`;

const CertImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 4px;
`;

const CertInfo = styled.div`
  width: 100%;
  background: ${({ theme }) => `${theme.colors.background}f8`};
  backdrop-filter: blur(8px);
  padding: 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  transform: translateY(0);

  h3 {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 0.85rem;
    margin-bottom: 0.25rem;
    font-family: 'JetBrains Mono', monospace;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.75rem;
    margin-bottom: 0.25rem;
    font-family: 'JetBrains Mono', monospace;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .tech-icon {
    color: ${({ theme }) => theme.colors.primary};
    margin-right: 0.5rem;
  }
`;

const ViewButton = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => `${theme.colors.background}f8`};
  backdrop-filter: blur(8px);
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-top: 1px solid ${({ theme }) => theme.colors.primary};
  transform: translateY(100%);
`;

export default function Certifications() {
  return (
    <CertificationsContainer id="certifications">
      <KDEWindow
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <WindowHeader>
          <WindowButton color="#ff5f56" />
          <WindowButton color="#ffbd2e" />
          <WindowButton color="#27c93f" />
          <WindowTitle>~/certifications</WindowTitle>
        </WindowHeader>
        
        <CertGrid>
          {certificates.certificates.map((cert, index) => (
            <CertCard 
              key={index}
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <CertContent>
                <CertImageWrapper>
                  <CertImage 
                    src={cert.thumbnail} 
                    alt={cert.name}
                  />
                </CertImageWrapper>
                <CertInfo className="cert-info">
                  <h3>{cert.name}</h3>
                  <p>
                    <i className={`${cert.icon} tech-icon`}></i>
                    {cert.provider}
                  </p>
                  {cert.duration && <p>{cert.duration}</p>}
                </CertInfo>
                <ViewButton className="view-button">
                  View Certificate
                </ViewButton>
              </CertContent>
            </CertCard>
          ))}
        </CertGrid>
      </KDEWindow>
    </CertificationsContainer>
  );
} 