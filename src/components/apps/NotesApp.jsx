import { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  height: 100%;
  background: rgba(22, 28, 45, 0.95);
  font-family: 'Space Grotesk', sans-serif;
  color: ${({ theme }) => theme.colors.text};
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 180px;
  background: rgba(0, 0, 0, 0.25);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  padding: 12px 6px;
  box-sizing: border-box;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 110px;
  }
`;

const SidebarHeader = styled.div`
  font-size: 0.65rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  padding: 0 10px 10px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
`;

const FileItem = styled.button`
  background: ${({ $active }) => $active ? 'rgba(255, 255, 255, 0.05)' : 'transparent'};
  border: none;
  color: ${({ $active, theme }) => $active ? theme.colors.text : theme.colors.textSecondary};
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: inherit;
  font-size: 0.78rem;
  text-align: left;
  transition: all 0.2s ease;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
    color: ${({ theme }) => theme.colors.text};
  }

  i {
    font-size: 0.85rem;
    color: ${({ $active, theme }) => $active ? theme.colors.primary : 'inherit'};
    width: 14px;
    text-align: center;
  }
`;

const ContentPanel = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
`;

const FileMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 10px;
  margin-bottom: 14px;
  flex-shrink: 0;

  .name {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.82rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary};
  }

  .status {
    font-size: 0.7rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.7;
  }
`;

const FileViewer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  font-family: ${({ $isLog }) => $isLog ? "'IBM Plex Mono', monospace" : 'inherit'};
  font-size: ${({ $isLog }) => $isLog ? '0.78rem' : '0.88rem'};
  line-height: 1.5;
  color: ${({ $isLog }) => $isLog ? '#00ff41' : 'inherit'};
  text-shadow: ${({ $isLog }) => $isLog ? '0 0 3px rgba(0, 255, 65, 0.2)' : 'none'};
  white-space: pre-wrap;
  padding-right: 4px;

  /* Scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.08);
    border-radius: 3px;
  }

  .redacted {
    background: ${({ theme }) => theme.colors.text};
    color: transparent;
    border-radius: 2px;
    padding: 0 4px;
    user-select: none;
  }

  h3 {
    font-family: 'Syne', sans-serif;
    margin-top: 0;
    font-size: 1.15rem;
    color: ${({ theme }) => theme.colors.text};
    border-bottom: 1px dashed rgba(255, 255, 255, 0.08);
    padding-bottom: 6px;
  }
`;

const TextAreaInput = styled.textarea`
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 0.88rem;
  line-height: 1.5;
  resize: none;
  outline: none;
  padding: 0;
  box-sizing: border-box;
`;

const systemBootLog = `[BOOT] PORTFOLIO DEPLOYMENT SUCCESSFUL // INGRESS OK
[INFO] Initialising core client assets... done.
[INFO] Resolving 3D physics engine and canvas overlays...
[WARN] WebGL acceleration missing or slow: drawing secondary background nodes.
[INFO] Lenis scrolling system attached successfully (lerp = 0.08).
[INFO] Waveform audio mixer channel initialized.
[BOOT] SYSTEM STATUS: 100% SECURE & OPERATIONAL.
[BOOT] All window managers, process contexts, and task lists ready.
[INFO] guest-pc logged into terminal. Local time synchronised.`;

const projectHydraMD = `# PROJECT HYDRA (CONFIDENTIAL ROADMAP BRIEF)

This document contains classified roadmap briefings for Amrutesh's future site updates:

1. **Cyber HUD Layer**: Decouple overlay grids from parent DOM blocks and place inside standard React Portals.
   *Status: INTEGRATED & FULLY STABLE*

2. **Decouption Game**: Implement sweeps alignment mini-game directly in console inputs.
   *Status: INTEGRATED & FULLY STABLE*

3. **Lab Systems Expansion**:
   *Access code*: <span class="redacted">RED-ALPHA-9480-LOCK</span>
   *Repository Target*: <span class="redacted">https://github.com/amrutesh-naregal/lab-drafts</span>
   *Scheduled deployment*: Q3 2026.

4. **Multi-agent Orchestrator**: Create visual node graphs plotting AI helper execution paths.
   *Status: PLANNING*`;

export default function NotesApp() {
  const [selectedFile, setSelectedFile] = useState('system_boot.log');
  const [noteContent, setNoteContent] = useState('');

  // Synchronise localStorage on mount & updates
  useEffect(() => {
    const saved = localStorage.getItem('portfolio_scratchpad');
    if (saved !== null) {
      setNoteContent(saved);
    } else {
      const defaultText = 'CONFIDENTIAL DEVELOPER scratchpad.txt\n=========================================\n\nPhase 1 and Phase 2 OS integration completed successfully.\n\nUse this writable workspace to type notes, tasks, or brainstorming notes. It is automatically backed up to your browser\'s localStorage on every keystroke, ensuring persistence across reloads!';
      setNoteContent(defaultText);
      localStorage.setItem('portfolio_scratchpad', defaultText);
    }
  }, []);

  const handleNoteChange = (e) => {
    const val = e.target.value;
    setNoteContent(val);
    localStorage.setItem('portfolio_scratchpad', val);
  };

  return (
    <Container>
      <Sidebar>
        <SidebarHeader>Explorer</SidebarHeader>
        
        <FileItem 
          $active={selectedFile === 'system_boot.log'}
          onClick={() => setSelectedFile('system_boot.log')}
        >
          <i className="fas fa-terminal" />
          system_boot.log
        </FileItem>

        <FileItem 
          $active={selectedFile === 'project_hydra.md'}
          onClick={() => setSelectedFile('project_hydra.md')}
        >
          <i className="fas fa-shield-halved" />
          project_hydra.md
        </FileItem>

        <FileItem 
          $active={selectedFile === 'scratchpad.txt'}
          onClick={() => setSelectedFile('scratchpad.txt')}
        >
          <i className="fas fa-edit" />
          scratchpad.txt
        </FileItem>
      </Sidebar>

      <ContentPanel>
        <FileMeta>
          <span className="name">{selectedFile}</span>
          <span className="status">
            {selectedFile === 'scratchpad.txt' ? 'Auto-Saved' : 'Read-Only'}
          </span>
        </FileMeta>

        {selectedFile === 'system_boot.log' && (
          <FileViewer $isLog={true}>{systemBootLog}</FileViewer>
        )}

        {selectedFile === 'project_hydra.md' && (
          <FileViewer $isLog={false}>
            <div dangerouslySetInnerHTML={{ __html: projectHydraMD }} />
          </FileViewer>
        )}

        {selectedFile === 'scratchpad.txt' && (
          <TextAreaInput 
            value={noteContent}
            onChange={handleNoteChange}
            placeholder="Type notes here (saved in localstorage)..."
          />
        )}
      </ContentPanel>
    </Container>
  );
}
