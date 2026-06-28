'use client';

import { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════════
   ANIMATIONS & KEYFRAMES
   ═══════════════════════════════════════════════════════════════════════ */

const slideDown = keyframes`
  from { transform: translateY(-8px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

/* ═══════════════════════════════════════════════════════════════════════
   STYLED COMPONENTS
   ═══════════════════════════════════════════════════════════════════════ */

const BrowserShell = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${({ theme }) => theme.colors.background || '#07070c'};
  color: ${({ theme }) => theme.colors.text || '#eaeaf2'};
  font-family: 'DM Mono', 'Fira Code', monospace;
  overflow: hidden;
  position: relative;
`;

/* ─── Tab Bar Container ────────────────────────────────────────────────── */
const TabBar = styled.div`
  display: flex;
  align-items: flex-end;
  background: ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.4)'};
  padding: 6px 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  gap: 4px;
  overflow-x: auto;
  flex-shrink: 0;
  height: 38px;
  box-sizing: border-box;

  /* Hide scrollbar */
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
`;

const TabItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: ${({ $active, theme }) => $active ? (theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.08)') : (theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.02)')};
  border: 1px solid ${({ $active, theme }) => $active ? theme.colors.border : 'transparent'};
  border-bottom: ${({ $active, theme }) => $active ? `2px solid ${theme.colors.primary}` : 'none'};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  font-size: 0.68rem;
  max-width: 160px;
  min-width: 90px;
  cursor: pointer;
  transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  position: relative;
  overflow: hidden;

  &:hover {
    background: ${({ $active, theme }) => $active ? (theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.08)') : (theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.05)')};
    border-color: ${({ theme }) => theme.colors.border};
  }

  .tab-title {
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${({ $active, theme }) => $active ? theme.colors.text : theme.colors.textSecondary};
  }

  .tab-icon {
    font-size: 0.65rem;
    color: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.textSecondary};
    flex-shrink: 0;
  }

  .tab-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    font-size: 0.55rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    transition: all 0.15s ease;
    flex-shrink: 0;

    &:hover {
      background: ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.15)'};
      color: #ef4444;
    }
  }
`;

const AddTabBtn = styled.button`
  background: ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.03)'};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.08)'};
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
    transform: scale(1.05);
  }
`;

/* ─── Navigation & Address Bar ────────────────────────────────────────── */
const ControlBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(255, 255, 255, 0.45)' : 'rgba(7, 7, 12, 0.4)'};
  backdrop-filter: blur(14px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 8px 16px;
  flex-shrink: 0;
  z-index: 10;
`;

const NavButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  button {
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: pointer;
    font-size: 0.75rem;
    width: 26px;
    height: 26px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      color: ${({ theme }) => theme.colors.text};
      background: ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.06)'};
    }

    &:disabled {
      opacity: 0.22;
      cursor: not-allowed;
    }
  }
`;

const AddressForm = styled.form`
  flex-grow: 1;
  display: flex;
  align-items: center;
`;

const AddressBar = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(0, 0, 0, 0.35)'};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 5px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all 0.22s ease;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary}80;
    background: ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.06)' : 'rgba(0, 0, 0, 0.45)'};
    box-shadow: 0 0 10px ${({ theme }) => theme.colors.primary}15;
  }

  .sec-icon {
    font-size: 0.65rem;
    color: #22c55e;
  }

  input {
    flex-grow: 1;
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.colors.text};
    font-family: inherit;
    font-size: inherit;
    outline: none;
    letter-spacing: 0.5px;
  }
`;

const ExternalLinkBtn = styled.a`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.5);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.65rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => (theme.colors.primary || '#6366f1')}12;
    border-color: ${({ theme }) => theme.colors.primary || '#6366f1'}60;
    color: ${({ theme }) => theme.colors.primary || '#6366f1'};
    transform: translateY(-1px);
  }
`;

/* ─── Bookmarks Bar ────────────────────────────────────────────────────── */
const BookmarksRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  background: ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(0, 0, 0, 0.22)'};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.65rem;
  flex-shrink: 0;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }

  .bookmarks-label {
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-right: 4px;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.58rem;
    letter-spacing: 1px;
  }
`;

const BookmarkBtn = styled.button`
  background: ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 3px 8px;
  border-radius: 5px;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.07)'};
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary}40;
  }

  i {
    font-size: 0.6rem;
  }
`;

/* ─── Viewport & Frame ────────────────────────────────────────────────── */
const Viewport = styled.div`
  flex-grow: 1;
  display: flex;
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};
`;

const SandboxIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  background: #ffffff;
`;

const EmbedWarningPanel = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(7, 7, 12, 0.92);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 10px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  font-size: 0.62rem;
  z-index: 100;
  animation: ${slideDown} 0.3s ease-out;

  .warning-content {
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgba(255, 255, 255, 0.65);
    i {
      color: #eab308;
      font-size: 0.8rem;
    }
  }
`;

/* ─── Homepage Dashboard UI ───────────────────────────────────────────── */
const Dashboard = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 40px 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 5;
  background: ${({ theme }) => theme.name === 'Light Mode' 
    ? 'radial-gradient(circle at center, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0) 70%)' 
    : 'radial-gradient(circle at center, rgba(30,30,55,0.15) 0%, rgba(3,3,7,0) 70%)'};

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.08);
    border-radius: 3px;
  }
`;

const DashboardLogo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
  text-align: center;

  .logo-icon {
    font-size: 1.8rem;
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary || '#6366f1'} 0%, #a855f7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 8px;
    filter: drop-shadow(0 0 12px ${({ theme }) => theme.colors.primary || '#6366f1'}40);
  }

  h1 {
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: 4px;
    text-transform: uppercase;
    margin: 0;
    background: ${({ theme }) => theme.name === 'Light Mode' 
      ? `linear-gradient(to right, ${theme.colors.text}, ${theme.colors.textSecondary})`
      : 'linear-gradient(to right, #ffffff, rgba(255, 255, 255, 0.7))'};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    font-size: 0.6rem;
    color: rgba(255, 255, 255, 0.35);
    margin: 4px 0 0;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
`;

const SearchForm = styled.form`
  width: 100%;
  max-width: 460px;
  margin-bottom: 36px;
`;

const LargeSearchBox = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.03)'};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 10px 16px;
  gap: 12px;
  transition: all 0.26s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary}80;
    background: ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.05)'};
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15), 0 0 20px ${({ theme }) => theme.colors.primary}20;
    transform: translateY(-1px);
  }

  i {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.82rem;
  }

  input {
    flex-grow: 1;
    background: transparent;
    border: none;
    outline: none;
    color: ${({ theme }) => theme.colors.text};
    font-family: inherit;
    font-size: 0.78rem;
    letter-spacing: 0.5px;

    &::placeholder {
      color: ${({ theme }) => theme.colors.textSecondary}80;
    }
  }
`;

const BookmarksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 180px);
  gap: 16px;
  justify-content: center;
  margin-bottom: 40px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    width: 100%;
    max-width: 280px;
  }
`;

const BookmarkCard = styled(motion.div)`
  background: ${({ theme }) => theme.name === 'Light Mode' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 18px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at top right, ${({ $glowColor }) => $glowColor}15, transparent 60%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary}40;
    &::before { opacity: 1; }
  }

  .card-icon {
    font-size: 1.5rem;
    color: ${({ $glowColor }) => $glowColor};
    margin-bottom: 12px;
    z-index: 2;
  }

  .card-name {
    font-size: 0.72rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 4px;
    z-index: 2;
  }

  .card-desc {
    font-size: 0.58rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    line-height: 1.3;
    z-index: 2;
  }
`;

const HelpCard = styled.div`
  background: rgba(0, 0, 0, 0.01);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 12px 18px;
  max-width: 440px;
  text-align: center;

  p {
    font-size: 0.58rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 0;
    line-height: 1.4;
    letter-spacing: 0.2px;
  }
`;

/* ═══════════════════════════════════════════════════════════════════════
   DATA & CONSTANTS
   ═══════════════════════════════════════════════════════════════════════ */

const BOOKMARKS = [
  {
    name: 'Aethrops Lab',
    url: 'https://aethrops.amrutlabs.in/',
    icon: 'fas fa-flask',
    desc: 'AI Dashboard & Consulting console',
    color: '#38bdf8'
  },
  {
    name: 'GitHub Profile',
    url: 'https://github.com/DragonEmperor9480',
    icon: 'fab fa-github',
    desc: 'DragonEmperor9480 development source',
    color: '#c084fc'
  }
];

/* ═══════════════════════════════════════════════════════════════════════
   MAIN EXPORT COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

export default function BrowserApp() {
  const [tabs, setTabs] = useState(() => [
    {
      id: '1',
      url: 'newtab',
      inputUrl: '',
      history: ['newtab'],
      historyIndex: 0,
      title: 'New Tab'
    }
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [showEmbedWarning, setShowEmbedWarning] = useState(false);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0] || {
    id: '1',
    url: 'newtab',
    inputUrl: '',
    history: ['newtab'],
    historyIndex: 0,
    title: 'New Tab'
  };

  const iframeRef = useRef(null);

  // Monitor tab URL changes to trigger sandbox hints for pages likely to restrict iframes
  useEffect(() => {
    if (activeTab.url !== 'newtab' && activeTab.url !== 'about:blank') {
      const isEmbedRestricted = 
        activeTab.url.includes('github.com') || 
        activeTab.url.includes('google.com') ||
        activeTab.url.includes('youtube.com');
      setShowEmbedWarning(isEmbedRestricted);
    } else {
      setShowEmbedWarning(false);
    }
  }, [activeTab.url]);

  const getTabTitle = (url) => {
    if (url === 'newtab' || url === 'about:blank') return 'New Tab';
    if (url.includes('aethrops.amrutlabs.in')) return 'Aethrops Lab';
    if (url.includes('github.com/DragonEmperor9480')) return 'DragonEmperor9480 (GH)';
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace('www.', '');
    } catch (e) {
      return url;
    }
  };

  const createTab = (initialUrl = 'newtab') => {
    const newId = Date.now().toString();
    const newTab = {
      id: newId,
      url: initialUrl,
      inputUrl: initialUrl === 'newtab' ? '' : initialUrl,
      history: [initialUrl],
      historyIndex: 0,
      title: getTabTitle(initialUrl)
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newId);
  };

  const closeTab = (tabId, e) => {
    if (e) e.stopPropagation();

    if (tabs.length === 1) {
      // If closing the last tab, reset it back to home screen
      setTabs([
        {
          id: '1',
          url: 'newtab',
          inputUrl: '',
          history: ['newtab'],
          historyIndex: 0,
          title: 'New Tab'
        }
      ]);
      setActiveTabId('1');
      return;
    }

    const tabIndex = tabs.findIndex(t => t.id === tabId);
    const updatedTabs = tabs.filter(t => t.id !== tabId);
    setTabs(updatedTabs);

    if (activeTabId === tabId) {
      const nextActiveIndex = Math.max(0, tabIndex - 1);
      setActiveTabId(updatedTabs[nextActiveIndex].id);
    }
  };

  const navigateTo = (targetUrl) => {
    let cleanUrl = targetUrl.trim();
    if (!cleanUrl) {
      cleanUrl = 'newtab';
    } else if (cleanUrl !== 'newtab' && cleanUrl !== 'about:blank') {
      if (!/^https?:\/\//i.test(cleanUrl)) {
        // Simple search check
        if (cleanUrl.includes('.') && !cleanUrl.includes(' ')) {
          cleanUrl = `https://${cleanUrl}`;
        } else {
          // Default to DuckDuckGo search query
          cleanUrl = `https://duckduckgo.com/?q=${encodeURIComponent(cleanUrl)}`;
        }
      }
    }

    setTabs(prev => prev.map(t => {
      if (t.id === activeTabId) {
        const nextHistory = t.history.slice(0, t.historyIndex + 1);
        nextHistory.push(cleanUrl);
        return {
          ...t,
          url: cleanUrl,
          inputUrl: cleanUrl === 'newtab' ? '' : cleanUrl,
          history: nextHistory,
          historyIndex: nextHistory.length - 1,
          title: getTabTitle(cleanUrl)
        };
      }
      return t;
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (activeTab.inputUrl.trim()) {
      navigateTo(activeTab.inputUrl);
    }
  };

  const handleBack = () => {
    setTabs(prev => prev.map(t => {
      if (t.id === activeTabId && t.historyIndex > 0) {
        const prevIdx = t.historyIndex - 1;
        const prevUrl = t.history[prevIdx];
        return {
          ...t,
          historyIndex: prevIdx,
          url: prevUrl,
          inputUrl: prevUrl === 'newtab' ? '' : prevUrl,
          title: getTabTitle(prevUrl)
        };
      }
      return t;
    }));
  };

  const handleForward = () => {
    setTabs(prev => prev.map(t => {
      if (t.id === activeTabId && t.historyIndex < t.history.length - 1) {
        const nextIdx = t.historyIndex + 1;
        const nextUrl = t.history[nextIdx];
        return {
          ...t,
          historyIndex: nextIdx,
          url: nextUrl,
          inputUrl: nextUrl === 'newtab' ? '' : nextUrl,
          title: getTabTitle(nextUrl)
        };
      }
      return t;
    }));
  };

  const handleRefresh = () => {
    if (iframeRef.current && activeTab.url !== 'newtab') {
      iframeRef.current.src = activeTab.url;
    }
  };

  const handleHome = () => {
    navigateTo('newtab');
  };

  const updateInputUrl = (value) => {
    setTabs(prev => prev.map(t => {
      if (t.id === activeTabId) {
        return { ...t, inputUrl: value };
      }
      return t;
    }));
  };

  const getTabIcon = (url) => {
    if (url === 'newtab') return 'fas fa-home';
    if (url.includes('github.com')) return 'fab fa-github';
    if (url.includes('aethrops.amrutlabs.in')) return 'fas fa-flask';
    return 'fas fa-globe';
  };

  return (
    <BrowserShell>
      {/* ─── Tab Strip ─── */}
      <TabBar>
        {tabs.map((tab) => (
          <TabItem
            key={tab.id}
            $active={tab.id === activeTabId}
            onClick={() => setActiveTabId(tab.id)}
          >
            <i className={`${getTabIcon(tab.url)} tab-icon`} />
            <span className="tab-title">{tab.title}</span>
            <span 
              className="tab-close" 
              onClick={(e) => closeTab(tab.id, e)}
              title="Close Tab"
            >
              <i className="fas fa-times" />
            </span>
          </TabItem>
        ))}
        <AddTabBtn onClick={() => createTab()} title="Open New Tab">
          <i className="fas fa-plus" />
        </AddTabBtn>
      </TabBar>

      {/* ─── Control & Address Bar ─── */}
      <ControlBar>
        <NavButtons>
          <button
            onClick={handleBack}
            disabled={activeTab.historyIndex === 0}
            title="Back"
          >
            <i className="fas fa-arrow-left" />
          </button>
          <button
            onClick={handleForward}
            disabled={activeTab.historyIndex === activeTab.history.length - 1}
            title="Forward"
          >
            <i className="fas fa-arrow-right" />
          </button>
          <button 
            onClick={handleRefresh} 
            disabled={activeTab.url === 'newtab'}
            title="Refresh"
          >
            <i className="fas fa-redo" />
          </button>
          <button onClick={handleHome} title="Home Page">
            <i className="fas fa-home" />
          </button>
        </NavButtons>

        <AddressForm onSubmit={handleFormSubmit}>
          <AddressBar>
            <i className={`fas sec-icon ${activeTab.url === 'newtab' ? 'fa-search' : 'fa-lock'}`} />
            <input
              type="text"
              value={activeTab.inputUrl}
              onChange={(e) => updateInputUrl(e.target.value)}
              placeholder="Search or enter URL..."
            />
          </AddressBar>
        </AddressForm>

        {activeTab.url !== 'newtab' && (
          <ExternalLinkBtn
            href={activeTab.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open website in native browser window"
          >
            <i className="fas fa-external-link-alt" />
            <span style={{ fontSize: '0.58rem' }}>Open Ext</span>
          </ExternalLinkBtn>
        )}
      </ControlBar>

      {/* ─── Bookmarks Bar ─── */}
      <BookmarksRow>
        <span className="bookmarks-label">Quick Links:</span>
        {BOOKMARKS.map((bookmark) => (
          <BookmarkBtn
            key={bookmark.name}
            onClick={() => navigateTo(bookmark.url)}
          >
            <i className={bookmark.icon} style={{ color: bookmark.color }} />
            {bookmark.name}
          </BookmarkBtn>
        ))}
      </BookmarksRow>

      {/* ─── Main Viewport ─── */}
      <Viewport>
        {activeTab.url === 'newtab' ? (
          <Dashboard>
            <DashboardLogo>
              <div className="logo-icon">
                <i className="fas fa-compass" />
              </div>
              <h1>Nexus Web Sandbox</h1>
              <p>Sandboxed Multi-Tab Web Environment</p>
            </DashboardLogo>

            <SearchForm onSubmit={handleFormSubmit}>
              <LargeSearchBox>
                <i className="fas fa-search" />
                <input
                  type="text"
                  value={activeTab.inputUrl}
                  onChange={(e) => updateInputUrl(e.target.value)}
                  placeholder="Enter a website URL or search the web..."
                />
              </LargeSearchBox>
            </SearchForm>

            <BookmarksGrid>
              {BOOKMARKS.map((bm, index) => (
                <BookmarkCard
                  key={bm.name}
                  $glowColor={bm.color}
                  onClick={() => navigateTo(bm.url)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.03 }}
                >
                  <i className={`${bm.icon} card-icon`} />
                  <div className="card-name">{bm.name}</div>
                  <div className="card-desc">{bm.desc}</div>
                </BookmarkCard>
              ))}
            </BookmarksGrid>

            <HelpCard>
              <p>
                🛡️ **IFrame Sandbox Security Note**
                <br />
                Many services (Google, YouTube, GitHub, etc.) block nesting inside frames via security policies (X-Frame-Options). 
                If you encounter a connection error, use the **Open Ext** link in the navigation header to open pages securely in a new browser window.
              </p>
            </HelpCard>
          </Dashboard>
        ) : (
          <SandboxIframe
            ref={iframeRef}
            src={activeTab.url}
            sandbox="allow-scripts allow-same-origin allow-popups"
            title={`Web Tab: ${activeTab.title}`}
          />
        )}

        {/* ─── Sandbox Bypass Warning Overlay ─── */}
        <AnimatePresence>
          {showEmbedWarning && (
            <EmbedWarningPanel>
              <div className="warning-content">
                <i className="fas fa-exclamation-triangle" />
                <span>
                  This service might block iframe embedding. Click **Open Website** to launch in a standard external window if needed.
                </span>
              </div>
              <ExternalLinkBtn
                href={activeTab.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)' }}
              >
                Open Website
              </ExternalLinkBtn>
            </EmbedWarningPanel>
          )}
        </AnimatePresence>
      </Viewport>
    </BrowserShell>
  );
}
