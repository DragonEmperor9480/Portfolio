import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import certificates from '../../data/certificates.json';

const CertificationsContainer = styled.section`
  width: 100%;
  max-width: 1200px;
  padding: 2rem;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  align-items: center;
  margin: 0 auto;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    padding: 1.5rem;
    max-width: calc(100vw - 2rem);
  }

  @media (max-width: 768px) {
    padding: 1rem;
    min-height: auto;
    max-width: calc(100vw - 1rem);
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
    max-width: calc(100vw - 0.5rem);
  }
`;

const VSCodeWindow = styled(motion.div)`
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(20px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  width: 100%;
  max-width: 100%;
  height: 700px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    height: 600px;
    max-width: calc(100vw - 4rem);
  }

  @media (max-width: 768px) {
    height: 500px;
    border-radius: 6px;
    max-width: calc(100vw - 2rem);
  }

  @media (max-width: 480px) {
    height: 400px;
    border-radius: 4px;
    max-width: calc(100vw - 1rem);
  }
`;

const TitleBar = styled.div`
  background: ${({ theme }) => theme.colors.background};
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const WindowControls = styled.div`
  display: flex;
  gap: 8px;
`;

const WindowButton = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
`;

const WindowTitle = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  font-family: 'JetBrains Mono', monospace;
  text-align: center;
  flex: 1;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  position: relative;
  box-sizing: border-box;
  min-width: 0;
`;

const Sidebar = styled.div`
  width: 300px;
  background: ${({ theme }) => theme.colors.background};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    width: 250px;
  }

  @media (max-width: 768px) {
    width: 200px;
  }

  @media (max-width: 480px) {
    width: 150px;
  }
`;

const SidebarHeader = styled.div`
  padding: 8px 16px;
  background: ${({ theme }) => theme.colors.glass};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.85rem;
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FileList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const FileItem = styled.div`
  padding: 6px 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: ${props => props.isActive ? `2px solid ${props.theme.colors.primary}` : '2px solid transparent'};
  background: ${props => props.isActive ? `${props.theme.colors.primary}20` : 'transparent'};
  
  &:hover {
    background: ${props => props.isActive ? `${props.theme.colors.primary}20` : `${props.theme.colors.border}30`};
  }
  
  .file-icon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    color: ${props => props.iconColor || props.theme.colors.text};
    font-size: 0.8rem;
  }
  
  .file-name {
    color: ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.text};
    font-size: 0.85rem;
    font-family: 'JetBrains Mono', monospace;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .file-extension {
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-left: auto;
    font-size: 0.75rem;
  }
`;

const EditorArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background};
  position: relative;
  width: calc(100% - 300px);
  min-width: 0;
  overflow: hidden;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    width: calc(100% - 250px);
  }

  @media (max-width: 768px) {
    width: calc(100% - 200px);
  }

  @media (max-width: 480px) {
    width: calc(100% - 150px);
  }
`;

const TabBar = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.glass};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  min-height: 35px;
  max-height: 35px;
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const Tab = styled.div`
  display: flex;
  align-items: center;
  padding: 0 16px;
  background: ${props => props.isActive ? props.theme.colors.background : props.theme.colors.glass};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  min-width: 160px;
  max-width: 200px;
  width: 180px;
  box-sizing: border-box;
  
  &:hover {
    background: ${props => props.isActive ? props.theme.colors.background : `${props.theme.colors.border}50`};
  }
  
  .tab-icon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    color: ${props => props.iconColor || props.theme.colors.text};
    font-size: 0.8rem;
    flex-shrink: 0;
  }
  
  .tab-name {
    color: ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.text};
    font-size: 0.85rem;
    font-family: 'JetBrains Mono', monospace;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }
  
  .close-button {
    margin-left: 8px;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    opacity: 0.7;
    flex-shrink: 0;
    
    &:hover {
      background: ${({ theme }) => theme.colors.border};
      opacity: 1;
    }
  }

  @media (max-width: 1024px) {
    min-width: 140px;
    max-width: 180px;
    width: 160px;
    padding: 0 12px;
  }

  @media (max-width: 768px) {
    min-width: 120px;
    max-width: 140px;
    width: 130px;
    padding: 0 8px;
    
    .tab-icon {
      width: 14px;
      height: 14px;
      margin-right: 6px;
    }
    
    .tab-name {
      font-size: 0.75rem;
    }
    
    .close-button {
      width: 14px;
      height: 14px;
      margin-left: 6px;
    }
  }

  @media (max-width: 480px) {
    min-width: 100px;
    max-width: 120px;
    width: 110px;
    padding: 0 6px;

    .tab-icon {
      width: 12px;
      height: 12px;
      margin-right: 4px;
    }

    .tab-name {
      font-size: 0.7rem;
    }

    .close-button {
      width: 12px;
      height: 12px;
      margin-left: 4px;
    }
  }
`;

const Editor = styled.div`
  flex: 1;
  padding: 16px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 12px;
  }

  @media (max-width: 480px) {
    padding: 8px;
  }
`;

const CertificatePreview = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: relative;
`;

const PreviewHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.glass};
`;

const CertTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.2rem;
  margin-bottom: 8px;
  font-family: 'JetBrains Mono', monospace;
`;

const CertMeta = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.85rem;
    font-family: 'JetBrains Mono', monospace;
    
    .icon {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  
  button {
    padding: 6px 12px;
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.background};
    border: none;
    border-radius: 4px;
    font-size: 0.8rem;
    cursor: pointer;
    font-family: 'JetBrains Mono', monospace;
    transition: all 0.2s ease;
    
    &:hover {
      opacity: 0.8;
      transform: translateY(-1px);
    }
    
    &.secondary {
      background: ${({ theme }) => theme.colors.border};
      color: ${({ theme }) => theme.colors.text};
      
      &:hover {
        background: ${({ theme }) => theme.colors.textSecondary};
      }
    }
  }
`;

const PreviewContent = styled.div`
  flex: 1;
  padding: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  position: relative;
`;

const CertificateImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  width: 100%;
  position: relative;
  left: 0;
  right: 0;
`;

const CertificateImage = styled.img`
  width: 100%;
  max-width: 600px;
  height: auto;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    max-width: 100%;
    border-radius: 6px;
  }

  @media (max-width: 480px) {
    border-radius: 4px;
  }
`;


const WelcomeScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
  
  .icon {
    font-size: 4rem;
    margin-bottom: 16px;
    color: ${({ theme }) => theme.colors.primary};
  }
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 8px;
    color: ${({ theme }) => theme.colors.text};
  }
  
  p {
    font-size: 0.9rem;
    line-height: 1.5;
  }
`;

// Helper function to get file icon color based on provider
const getFileIconColor = (provider) => {
  const colors = {
    'GeeksForGeeks': '#2f8d46',
    'KodeKloud': '#ff6b35',
    'LinkedIn Learning': '#0077b5',
    'Udemy': '#a435f0',
    'Scaler': '#ff4757'
  };
  return colors[provider] || '#cccccc';
};



export default function Certifications() {
  const [activeTab, setActiveTab] = useState(null);
  const [openTabs, setOpenTabs] = useState([]);

  const openCertificate = (cert, index) => {
    const tabId = `cert-${index}`;
    if (!openTabs.find(tab => tab.id === tabId)) {
      setOpenTabs([...openTabs, { id: tabId, cert, index }]);
    }
    setActiveTab(tabId);
  };

  const closeTab = (tabId, e) => {
    e.stopPropagation();
    const newTabs = openTabs.filter(tab => tab.id !== tabId);
    setOpenTabs(newTabs);
    
    if (activeTab === tabId) {
      setActiveTab(newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null);
    }
  };

  // Handle mouse wheel scroll on tab bar
  const handleTabBarScroll = (e) => {
    const tabBar = e.currentTarget;
    const hasHorizontalScroll = tabBar.scrollWidth > tabBar.clientWidth;
    
    // Always prevent default when over tab bar to stop website scrolling
    e.preventDefault();
    e.stopPropagation();
    
    // Only actually scroll the tabs if there's overflow
    if (hasHorizontalScroll) {
      const scrollAmount = e.deltaY * 0.5; // Reduce scroll sensitivity
      tabBar.scrollLeft += scrollAmount;
    }
  };

  const activeCert = openTabs.find(tab => tab.id === activeTab)?.cert;

  return (
    <CertificationsContainer id="certifications">
      <VSCodeWindow
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <TitleBar>
          <WindowControls>
            <WindowButton color="#ff5f56" />
            <WindowButton color="#ffbd2e" />
            <WindowButton color="#27c93f" />
          </WindowControls>
          <WindowTitle>Certifications - Visual Studio Code</WindowTitle>
          <div style={{ width: '60px' }}></div>
        </TitleBar>
        
        <MainContent>
          <Sidebar>
            <SidebarHeader>
              <i className="fas fa-certificate" style={{ marginRight: '8px' }}></i>
              Certifications
            </SidebarHeader>
            <FileList>
              {certificates.certificates.map((cert, index) => (
                <FileItem
                  key={index}
                  isActive={activeTab === `cert-${index}`}
                  iconColor={getFileIconColor(cert.provider)}
                  onClick={() => openCertificate(cert, index)}
                >
                  <i className={`${cert.icon} file-icon`}></i>
                  <span className="file-name">
                    {cert.fileName}
                  </span>
                  <span className="file-extension">.cert.js</span>
                </FileItem>
              ))}
            </FileList>
          </Sidebar>

          <EditorArea>
            <TabBar onWheel={handleTabBarScroll}>
              {openTabs.map((tab) => (
                <Tab
                  key={tab.id}
                  isActive={activeTab === tab.id}
                  iconColor={getFileIconColor(tab.cert.provider)}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <i className={`${tab.cert.icon} tab-icon`}></i>
                  <span className="tab-name">
                    {tab.cert.fileName}.cert.js
                  </span>
                  <div className="close-button" onClick={(e) => closeTab(tab.id, e)}>
                    <i className="fas fa-times" style={{ fontSize: '0.7rem' }}></i>
                  </div>
                </Tab>
              ))}
            </TabBar>

            <Editor>
              {activeCert ? (
                <CertificatePreview>
                  <PreviewHeader>
                    <CertTitle>{activeCert.name}</CertTitle>
                    <CertMeta>
                      <div className="meta-item">
                        <i className={`${activeCert.icon} icon`}></i>
                        <span>{activeCert.provider}</span>
                      </div>
                      {activeCert.duration && (
                        <div className="meta-item">
                          <i className="fas fa-clock icon"></i>
                          <span>{activeCert.duration}</span>
                        </div>
                      )}
                      <div className="meta-item">
                        <i className="fas fa-certificate icon"></i>
                        <span>Verified</span>
                      </div>
                    </CertMeta>
                    <ActionButtons>
                      <button onClick={() => window.open(activeCert.link, '_blank')}>
                        <i className="fas fa-external-link-alt" style={{ marginRight: '6px' }}></i>
                        View Original
                      </button>
                      <button className="secondary">
                        <i className="fas fa-download" style={{ marginRight: '6px' }}></i>
                        Download
                      </button>
                    </ActionButtons>
                  </PreviewHeader>
                  
                  <PreviewContent>
                    <CertificateImageContainer>
                      <CertificateImage 
                        src={activeCert.thumbnail} 
                        alt={activeCert.name}
                      />
                    </CertificateImageContainer>
                  </PreviewContent>
                </CertificatePreview>
              ) : (
                <WelcomeScreen>
                  <i className="fas fa-certificate icon"></i>
                  <h3>Certificate Explorer</h3>
                  <p>Select a certification from the explorer to view details<br />
                     Click on any .cert file to open it in the editor</p>
                </WelcomeScreen>
              )}
            </Editor>
          </EditorArea>
        </MainContent>
      </VSCodeWindow>
    </CertificationsContainer>
  );
} 