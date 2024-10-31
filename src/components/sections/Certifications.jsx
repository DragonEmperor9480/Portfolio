import { motion } from 'framer-motion';
import styled from 'styled-components';
import certificatesData from '../../data/certificates.json';

const CertificationsContainer = styled.section`
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

const FileSystem = styled(motion.div)`
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

const FileSystemHeader = styled.div`
  background: rgba(10, 25, 47, 0.7);
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #64ffda;
`;

const FileSystemContent = styled.div`
  padding: 20px;
  color: ${({ theme }) => theme.colors.text};
`;

const Certificate = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  border-radius: 5px;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => `${theme.colors.primary}20`};
    transform: translateX(10px);
  }

  i {
    color: ${({ theme }) => theme.colors.primary};
    width: 20px;
  }

  .details {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .provider {
    font-size: 0.8rem;
    opacity: 0.7;
  }
`;

const CertificateItem = ({ cert, index }) => (
  <Certificate
    href={cert.link}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <i className={cert.icon}></i>
    <div className="details">
      <div className="name">{cert.name}</div>
      <div className="provider">{cert.provider}</div>
    </div>
  </Certificate>
);

export default function Certifications() {
  return (
    <CertificationsContainer id="certifications">
      <FileSystem
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <FileSystemHeader>
          <div>
            <i className="fas fa-folder-open"></i>
            {" "}~/certifications
          </div>
        </FileSystemHeader>
        <FileSystemContent>
          {certificatesData.certificates.map((cert, index) => (
            <CertificateItem key={index} cert={cert} index={index} />
          ))}
        </FileSystemContent>
      </FileSystem>
    </CertificationsContainer>
  );
} 