import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(13, 2, 8, 0.95);
  font-family: 'Fira Code', 'Space Mono', monospace;
  color: #00ff41;
  padding: 20px;
  box-sizing: border-box;
  text-shadow: 0 0 4px rgba(0, 255, 65, 0.4);
`;

const CommandLine = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 12px;
`;

export default function TerminalApp() {
  return (
    <Container>
      <div style={{ color: '#888', marginBottom: '8px' }}>PORTFOLIO CYBER SHELL v1.0.0</div>
      <div style={{ color: '#ffffff', fontWeight: 'bold' }}>Type `help` to list available processes.</div>
      <div style={{ margin: '12px 0', color: '#01cdfe' }}>
        [SYSTEM STATUS] Ready for decrypt operations...
      </div>
      
      <div style={{ color: '#555' }}>
        ----------------------------------------------------
      </div>
      
      <div style={{ marginTop: '16px', color: '#faef5d' }}>
        &gt; PHASE 1 CORE INITIALISED SUCCESSFULLY.
        <br />
        &gt; Phase 2 Terminal integration pending active command bindings.
      </div>
      
      <CommandLine>
        <span>guest@portfolio:~$</span>
        <span style={{ 
          width: '8px', 
          height: '15px', 
          background: '#00ff41', 
          display: 'inline-block',
          animation: 'pulse 1s infinite alternate'
        }} />
      </CommandLine>

      <style>{`
        @keyframes pulse {
          0% { opacity: 0.2; }
          100% { opacity: 1; }
        }
      `}</style>
    </Container>
  );
}
