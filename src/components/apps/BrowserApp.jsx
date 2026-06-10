import { useState, useRef } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(10, 25, 47, 0.95);
  font-family: 'Space Grotesk', sans-serif;
  color: ${({ theme }) => theme.colors.text};
  overflow: hidden;
`;

const BrowserHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.25);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 8px 16px;
  flex-shrink: 0;
  
  @media (max-width: 480px) {
    padding: 8px 10px;
    gap: 8px;
  }
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
    font-size: 0.82rem;
    padding: 6px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      color: ${({ theme }) => theme.colors.text};
      background: rgba(255,255,255,0.05);
    }

    &:disabled {
      opacity: 0.3;
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
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 4px 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary}50;
  }

  i.lock {
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
  }
`;

const LaunchExternalBtn = styled.a`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: ${({ theme }) => theme.colors.text};
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}12;
    border-color: ${({ theme }) => theme.colors.primary}60;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const BrowserBody = styled.div`
  flex-grow: 1;
  display: flex;
  position: relative;
  overflow: hidden;
  background: #060913;
`;

const SandboxIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  background: #ffffff;
`;

const ShieldOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(10, 25, 47, 0.94);
  backdrop-filter: blur(8px);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  font-size: 0.75rem;
  z-index: 10;

  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
`;

const QuickselectRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.12);
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  font-size: 0.72rem;
  flex-shrink: 0;
  overflow-x: auto;
  white-space: nowrap;

  .label {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.7;
    margin-right: 4px;
  }
`;

const BookmarkBtn = styled.button`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.05);
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 3px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255,255,255,0.08);
    color: ${({ theme }) => theme.colors.text};
    border-color: rgba(255,255,255,0.15);
  }
`;

const BOOKMARKS = [
  { name: 'Amrutesh GitHub', url: 'https://github.com/amrutesh-naregal', icon: 'fab fa-github' },
  { name: 'Vercel App',     url: 'https://amrut.vercel.app',            icon: 'fas fa-globe' },
  { name: 'Dev.to Blog',    url: 'https://dev.to',                      icon: 'fab fa-dev' },
  { name: 'Wikipedia',      url: 'https://en.m.wikipedia.org',          icon: 'fas fa-book-open' }
];

export default function BrowserApp() {
  const [url, setUrl] = useState('https://amrut.vercel.app');
  const [inputUrl, setInputUrl] = useState('https://amrut.vercel.app');
  const [history, setHistory] = useState(['https://amrut.vercel.app']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const iframeRef = useRef(null);

  const navigateTo = (targetUrl) => {
    let cleanUrl = targetUrl.trim();
    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = `https://${cleanUrl}`;
    }

    setUrl(cleanUrl);
    setInputUrl(cleanUrl);

    // Update forward history if needed
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(cleanUrl);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      navigateTo(inputUrl);
    }
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      setUrl(history[prevIdx]);
      setInputUrl(history[prevIdx]);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setUrl(history[nextIdx]);
      setInputUrl(history[nextIdx]);
    }
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      // Force iframe refresh
      iframeRef.current.src = url;
    }
  };

  return (
    <Container>
      <BrowserHeader>
        <NavButtons>
          <button 
            onClick={handleBack} 
            disabled={historyIndex === 0} 
            title="Go Back"
          >
            <i className="fas fa-arrow-left" />
          </button>
          <button 
            onClick={handleForward} 
            disabled={historyIndex === history.length - 1} 
            title="Go Forward"
          >
            <i className="fas fa-arrow-right" />
          </button>
          <button onClick={handleRefresh} title="Refresh Page">
            <i className="fas fa-redo" />
          </button>
        </NavButtons>

        <AddressForm onSubmit={handleFormSubmit}>
          <AddressBar>
            <i className="fas fa-lock lock" />
            <input 
              type="text" 
              value={inputUrl} 
              onChange={(e) => setInputUrl(e.target.value)} 
              placeholder="Enter URL to browse..."
            />
          </AddressBar>
        </AddressForm>

        <LaunchExternalBtn 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          title="Launch in New Tab"
        >
          <i className="fas fa-external-link-alt" />
          <span className="desktop-only">Open Tab</span>
        </LaunchExternalBtn>
      </BrowserHeader>

      <QuickselectRow>
        <span className="label">Bookmarks:</span>
        {BOOKMARKS.map((bookmark) => (
          <BookmarkBtn 
            key={bookmark.name} 
            onClick={() => navigateTo(bookmark.url)}
          >
            <i className={bookmark.icon} />
            {bookmark.name}
          </BookmarkBtn>
        ))}
      </QuickselectRow>

      <BrowserBody>
        <SandboxIframe 
          ref={iframeRef}
          src={url}
          sandbox="allow-scripts allow-same-origin allow-popups"
          title="Portfolio Browser Sandbox"
        />

        <ShieldOverlay>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fas fa-shield-alt" style={{ color: '#faef5d', fontSize: '1rem' }} />
            <span>
              If this site blocks inline embedding (Connection Refused), use <strong>Open Tab</strong> to browse securely.
            </span>
          </div>
          <LaunchExternalBtn 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ borderColor: 'rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.03)' }}
          >
            Open Website
          </LaunchExternalBtn>
        </ShieldOverlay>
      </BrowserBody>
    </Container>
  );
}
