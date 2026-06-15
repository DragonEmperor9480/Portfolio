'use client';

import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import Image from 'next/image';
import certificates from '../../data/certificates.json';

const CertificationsContainer = styled.section`
  width: 100%;
  max-width: 1400px;
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
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.name === 'Light Mode' ? '0 8px 32px 0 rgba(0, 0, 0, 0.08)' : '0 8px 32px 0 rgba(0, 0, 0, 0.37)'};
  width: 100%;
  max-width: 100%;
  height: 900px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    height: 800px;
    max-width: calc(100vw - 4rem);
  }

  @media (max-width: 768px) {
    height: 750px;
    border-radius: 8px;
    max-width: calc(100vw - 2rem);
  }

  @media (max-width: 480px) {
    height: 600px;
    border-radius: 6px;
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
  font-size: 0.8rem;
  font-family: 'JetBrains Mono', monospace;
  text-align: center;
  flex: 1;
  opacity: 0.8;
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
    width: 240px;
  }

  @media (max-width: 768px) {
    width: 200px;
  }

  @media (max-width: 480px) {
    width: 140px;
  }
`;

const SidebarHeader = styled.div`
  padding: 8px 16px;
  background: ${({ theme }) => theme.colors.glass};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.8;
`;

const ExplorerFolder = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.85;
  letter-spacing: 0.5px;
  cursor: pointer;
  
  .chevron {
    font-size: 0.6rem;
    transition: transform 0.2s ease;
  }
`;

const ExplorerSubFolder = styled(ExplorerFolder)`
  padding-left: 28px;
  font-weight: 600;
  text-transform: none;
  opacity: 0.75;
`;

const FileList = styled.div`
  flex: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)'};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.25)'};
  }
`;

const FileItem = styled.div`
  padding: 6px 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: ${props => props.$isActive ? `2px solid ${props.theme.colors.primary}` : '2px solid transparent'};
  background: ${props => props.$isActive ? `${props.theme.colors.primary}15` : 'transparent'};
  
  &:hover {
    background: ${props => props.$isActive ? `${props.theme.colors.primary}15` : `${props.theme.colors.primary}08`};
  }
  
  .file-icon {
    width: 14px;
    height: 14px;
    margin-right: 8px;
    color: ${props => props.$iconColor || props.theme.colors.text};
    font-size: 0.78rem;
    flex-shrink: 0;
  }
  
  .file-name {
    color: ${props => props.$isActive ? props.theme.colors.primary : props.theme.colors.text};
    font-size: 0.8rem;
    font-family: 'JetBrains Mono', monospace;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .file-extension {
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-left: auto;
    font-size: 0.72rem;
    opacity: 0.7;
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
    width: calc(100% - 240px);
  }

  @media (max-width: 768px) {
    width: calc(100% - 200px);
  }

  @media (max-width: 480px) {
    width: calc(100% - 140px);
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
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 2px;
  }
`;

const Tab = styled.div`
  display: flex;
  align-items: center;
  padding: 0 14px;
  background: ${props => props.$isActive ? props.theme.colors.background : 'transparent'};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  min-width: 150px;
  max-width: 200px;
  width: 170px;
  box-sizing: border-box;
  border-top: ${props => props.$isActive ? `2px solid ${props.theme.colors.primary}` : '2px solid transparent'};
  
  &:hover {
    background: ${props => props.$isActive ? props.theme.colors.background : `${props.theme.colors.primary}08`};
  }
  
  .tab-icon {
    width: 14px;
    height: 14px;
    margin-right: 8px;
    color: ${props => props.$iconColor || props.theme.colors.text};
    font-size: 0.78rem;
    flex-shrink: 0;
  }
  
  .tab-name {
    color: ${props => props.$isActive ? props.theme.colors.primary : props.theme.colors.text};
    font-size: 0.8rem;
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

  @media (max-width: 768px) {
    min-width: 110px;
    max-width: 130px;
    width: 120px;
    padding: 0 8px;
    
    .tab-icon {
      width: 12px;
      height: 12px;
      margin-right: 4px;
    }
    .tab-name {
      font-size: 0.72rem;
    }
  }
`;

const Breadcrumbs = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 4px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  min-height: 28px;
  max-height: 28px;
  box-sizing: border-box;
  opacity: 0.85;

  .path-container {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .item {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .separator {
    opacity: 0.45;
    font-size: 0.6rem;
  }
  
  .file {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
  }
`;

const ActionIcon = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.68rem;
  padding: 2px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primary}15;
  }
`;

const Editor = styled.div`
  flex: 1;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const CodePane = styled.div`
  flex: 1;
  padding: 16px;
  overflow: auto;
  display: flex;
  gap: 14px;
  font-family: 'JetBrains Mono', 'Fira Code', 'Space Mono', monospace;
  background: ${({ theme }) => theme.colors.background};

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)'};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.25)'};
  }
`;

const LineNumbers = styled.div`
  color: ${({ theme }) => theme.name === 'Light Mode' ? '#a0a0a0' : '#858585'};
  text-align: right;
  user-select: none;
  font-size: 0.8rem;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  min-width: 20px;
`;

const SyntaxHighlightedCode = styled.pre`
  margin: 0;
  font-family: inherit;
  font-size: 0.8rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.name === 'Light Mode' ? '#1e1e1e' : '#d4d4d4'};
  white-space: pre;
  
  .keyword {
    color: ${({ theme }) => theme.name === 'Light Mode' ? '#0000ff' : '#569cd6'};
  }
  .string {
    color: ${({ theme }) => theme.name === 'Light Mode' ? '#a31515' : '#ce9178'};
  }
  .comment {
    color: ${({ theme }) => theme.name === 'Light Mode' ? '#008000' : '#6a9955'};
  }
  .type {
    color: ${({ theme }) => theme.name === 'Light Mode' ? '#267f99' : '#4ec9b0'};
  }
  .variable {
    color: ${({ theme }) => theme.name === 'Light Mode' ? '#0070c1' : '#9cdcfe'};
  }
  .property {
    color: ${({ theme }) => theme.name === 'Light Mode' ? '#0451a5' : '#9cdcfe'};
  }
`;

const PreviewPane = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.glass};

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)'};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.25)'};
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
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.glass};
`;

const CertTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.15rem;
  margin-bottom: 8px;
  font-family: 'JetBrains Mono', monospace;
`;

const CertMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 14px;
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.8rem;
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
    font-size: 0.78rem;
    cursor: pointer;
    font-family: 'JetBrains Mono', monospace;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 6px;
    
    &:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
  }
`;

const PreviewContent = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  position: relative;
  box-sizing: border-box;
`;

const CertificateImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  width: 100%;
  position: relative;
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const ImageSkeleton = styled.div`
  width: 100%;
  max-width: 900px;
  height: 480px;
  border-radius: 12px;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.glass} 0%,
    rgba(100, 255, 218, 0.08) 50%,
    ${({ theme }) => theme.colors.glass} 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite linear;
  border: 1px solid ${({ theme }) => theme.colors.border};
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    border: 3px solid ${({ theme }) => theme.colors.border};
    border-top-color: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }

  @media (max-width: 768px) {
    max-width: 100%;
    height: 320px;
  }
`;

const CertificateImageWrapper = styled.div`
  width: 100%;
  max-width: 900px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: ${({ $loaded }) => ($loaded ? 'block' : 'none')};
  position: relative;
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
  padding: 40px;
  
  .icon {
    font-size: 3.5rem;
    margin-bottom: 16px;
    color: ${({ theme }) => theme.colors.primary};
    opacity: 0.8;
  }
  
  h3 {
    font-size: 1.15rem;
    margin-bottom: 8px;
    color: ${({ theme }) => theme.colors.text};
  }
  
  p {
    font-size: 0.82rem;
    line-height: 1.6;
    max-width: 400px;
    margin: 0 auto;
    opacity: 0.85;
  }
`;

const StatusBar = styled.div`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.68rem;
  font-weight: 500;
  box-sizing: border-box;
  flex-shrink: 0;
  user-select: none;
  
  .left-side, .right-side {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .status-item {
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    
    &:hover {
      opacity: 0.85;
    }
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
  const [imageLoaded, setImageLoaded] = useState({});
  const [viewMode, setViewMode] = useState('preview');

  const openCertificate = (cert, index) => {
    const tabId = `cert-${index}`;
    if (!openTabs.find(tab => tab.id === tabId)) {
      setOpenTabs([...openTabs, { id: tabId, cert, index }]);
      // Reset image loaded state for new tab
      setImageLoaded(prev => ({ ...prev, [tabId]: false }));
    }
    setActiveTab(tabId);
    setViewMode('preview');
  };

  const handleImageLoad = (tabId) => {
    setImageLoaded(prev => ({ ...prev, [tabId]: true }));
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
    
    e.preventDefault();
    e.stopPropagation();
    
    if (hasHorizontalScroll) {
      const scrollAmount = e.deltaY * 0.5;
      tabBar.scrollLeft += scrollAmount;
    }
  };

  const activeCert = openTabs.find(tab => tab.id === activeTab)?.cert;

  const generateCode = (cert) => {
    return `import { Certificate } from 'portfolio/os/credentials';

// Verified Professional Credential
const credential = new Certificate({
  name: "${cert.name}",
  provider: "${cert.provider}",
  duration: "${cert.duration || 'Self-paced'}",
  verified: true,
  credentialUrl: "${cert.link}"
});

export default credential;`;
  };

  const highlightJS = (code) => {
    const lines = code.split('\n');
    
    return lines.map((line, idx) => {
      if (line.trim().startsWith('//')) {
        return (
          <div key={idx} className="line">
            <span className="comment">{line}</span>
          </div>
        );
      }
      
      const words = line.split(/(\s+|[{}[\]().,;:"'])/);
      let isString = false;
      let stringDelimiter = null;
      let lineElements = [];
      let currentStr = '';
      
      for (let i = 0; i < words.length; i++) {
        const w = words[i];
        if (!w) continue;
        
        if (isString) {
          currentStr += w;
          if (w === stringDelimiter) {
            isString = false;
            lineElements.push(<span key={i} className="string">{currentStr}</span>);
            currentStr = '';
          }
          continue;
        }
        
        if (w === '"' || w === "'") {
          isString = true;
          stringDelimiter = w;
          currentStr = w;
          continue;
        }
        
        if (['const', 'import', 'from', 'export', 'default', 'new'].includes(w)) {
          lineElements.push(<span key={i} className="keyword">{w}</span>);
        } else if (['Certificate'].includes(w)) {
          lineElements.push(<span key={i} className="type">{w}</span>);
        } else if (['credential'].includes(w)) {
          lineElements.push(<span key={i} className="variable">{w}</span>);
        } else if (['name', 'provider', 'duration', 'verified', 'credentialUrl'].includes(w)) {
          lineElements.push(<span key={i} className="property">{w}</span>);
        } else {
          lineElements.push(w);
        }
      }
      
      if (isString) {
        lineElements.push(<span key="str" className="string">{currentStr}</span>);
      }
      
      return (
        <div key={idx} className="line">
          {lineElements}
        </div>
      );
    });
  };

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
            <SidebarHeader>Explorer</SidebarHeader>
            <ExplorerFolder>
              <i className="fas fa-chevron-down chevron" />
              <span>Portfolio [Workspace]</span>
            </ExplorerFolder>
            <ExplorerSubFolder>
              <i className="fas fa-chevron-down chevron" />
              <i className="fas fa-folder" style={{ color: '#dcb67a', marginRight: '2px' }} />
              <span>src</span>
            </ExplorerSubFolder>
            <ExplorerSubFolder style={{ paddingLeft: '40px' }}>
              <i className="fas fa-chevron-down chevron" />
              <i className="fas fa-folder" style={{ color: '#dcb67a', marginRight: '2px' }} />
              <span>sections</span>
            </ExplorerSubFolder>
            <ExplorerSubFolder style={{ paddingLeft: '52px' }}>
              <i className="fas fa-chevron-down chevron" />
              <i className="fas fa-folder-open" style={{ color: '#dcb67a', marginRight: '2px' }} />
              <span>certifications</span>
            </ExplorerSubFolder>
            <FileList>
              {certificates.certificates.map((cert, index) => (
                <FileItem
                  key={index}
                  $isActive={activeTab === `cert-${index}`}
                  $iconColor={getFileIconColor(cert.provider)}
                  onClick={() => openCertificate(cert, index)}
                  style={{ paddingLeft: '64px' }}
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
                  $isActive={activeTab === tab.id}
                  $iconColor={getFileIconColor(tab.cert.provider)}
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

            {activeCert && (
              <Breadcrumbs>
                <div className="path-container">
                  <div className="item">
                    <i className="fas fa-folder" style={{ color: '#dcb67a', fontSize: '0.75rem' }} />
                    <span>src</span>
                  </div>
                  <span className="separator">&gt;</span>
                  <div className="item">
                    <i className="fas fa-folder" style={{ color: '#dcb67a', fontSize: '0.75rem' }} />
                    <span>sections</span>
                  </div>
                  <span className="separator">&gt;</span>
                  <div className="item">
                    <i className="fas fa-folder-open" style={{ color: '#dcb67a', fontSize: '0.75rem' }} />
                    <span>certifications</span>
                  </div>
                  <span className="separator">&gt;</span>
                  <div className="item file">
                    <i className={`${activeCert.icon} icon`} style={{ color: getFileIconColor(activeCert.provider), fontSize: '0.75rem' }} />
                    <span>{activeCert.fileName}.cert.js</span>
                  </div>
                </div>

                <ActionIcon onClick={() => setViewMode(prev => prev === 'preview' ? 'code' : 'preview')}>
                  <i className={viewMode === 'preview' ? 'fas fa-code' : 'fas fa-eye'} style={{ fontSize: '0.75rem' }} />
                  <span>{viewMode === 'preview' ? 'Show Code' : 'Show Preview'}</span>
                </ActionIcon>
              </Breadcrumbs>
            )}

            <Editor>
              {activeCert ? (
                viewMode === 'code' ? (
                  <CodePane>
                    <LineNumbers>
                      {Array.from({ length: 13 }).map((_, i) => (
                        <span key={i}>{i + 1}</span>
                      ))}
                    </LineNumbers>
                    <SyntaxHighlightedCode>
                      {highlightJS(generateCode(activeCert))}
                    </SyntaxHighlightedCode>
                  </CodePane>
                ) : (
                  <PreviewPane>
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
                            <i className="fas fa-external-link-alt" style={{ marginRight: '4px' }}></i>
                            View Original
                          </button>
                        </ActionButtons>
                      </PreviewHeader>
                      
                      <PreviewContent>
                        <CertificateImageContainer>
                          {!imageLoaded[activeTab] && <ImageSkeleton />}
                          <CertificateImageWrapper $loaded={imageLoaded[activeTab]}>
                            <Image 
                              src={activeCert.thumbnail} 
                              alt={activeCert.name}
                              width={900}
                              height={620}
                              style={{
                                width: '100%',
                                height: 'auto',
                                display: 'block',
                              }}
                              onLoad={() => handleImageLoad(activeTab)}
                              onError={() => handleImageLoad(activeTab)}
                            />
                          </CertificateImageWrapper>
                        </CertificateImageContainer>
                      </PreviewContent>
                    </CertificatePreview>
                  </PreviewPane>
                )
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

        <StatusBar>
          <div className="left-side">
            <div className="status-item">
              <i className="fas fa-code-branch" />
              <span>main</span>
            </div>
            <div className="status-item">
              <i className="fas fa-sync-alt" />
            </div>
            <div className="status-item">
              <i className="fas fa-times-circle" />
              <span>0</span>
              <i className="fas fa-exclamation-triangle" />
              <span>0</span>
            </div>
          </div>
          <div className="right-side">
            <div className="status-item">
              <span>Ln {activeCert ? '13' : '1'}, Col {activeCert ? '24' : '1'}</span>
            </div>
            <div className="status-item">
              <span>Spaces: 2</span>
            </div>
            <div className="status-item">
              <span>UTF-8</span>
            </div>
            <div className="status-item">
              <span>JavaScript</span>
            </div>
            <div className="status-item">
              <i className="fas fa-bell" />
            </div>
          </div>
        </StatusBar>
      </VSCodeWindow>
    </CertificationsContainer>
  );
}