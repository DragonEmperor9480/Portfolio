import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(26, 15, 36, 0.95);
  font-family: 'Space Grotesk', sans-serif;
  color: ${({ theme }) => theme.colors.text};
  padding: 24px;
  box-sizing: border-box;
  justify-content: space-between;
`;

const PlaybackCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid ${({ theme }) => theme.colors.primary}15;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
`;

const PlaybackControls = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  button {
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.colors.text};
    cursor: pointer;
    font-size: 1.2rem;
    transition: all 0.2s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
      transform: scale(1.1);
    }

    &.play-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.background};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;

      &:hover {
        box-shadow: 0 0 15px ${({ theme }) => theme.colors.primary}60;
      }
    }
  }
`;

const WaveformMock = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  gap: 3px;
  width: 100%;
  justify-content: center;

  span {
    display: inline-block;
    width: 3px;
    height: 100%;
    background: ${({ theme }) => theme.colors.primary}40;
    border-radius: 20px;
    
    &:nth-child(even) {
      height: 60%;
    }
    &:nth-child(3n) {
      height: 80%;
    }
    &:nth-child(5n) {
      height: 40%;
    }
  }
`;

export default function MusicApp() {
  return (
    <Container>
      <PlaybackCard>
        <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justify: 'center' }}>
          <i className="fas fa-compact-disc fa-spin" style={{ fontSize: '2rem', color: '#f97e72' }} />
        </div>
        <div>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>Cyber Synthwave Session</h4>
          <span style={{ fontSize: '0.8rem', color: '#888' }}>Lofi Ambient Streams</span>
        </div>
        
        <WaveformMock>
          {[...Array(24)].map((_, i) => (
            <span key={i} />
          ))}
        </WaveformMock>
      </PlaybackCard>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        <PlaybackControls>
          <button><i className="fas fa-backward" /></button>
          <button className="play-btn"><i className="fas fa-play" style={{ marginLeft: '2px' }} /></button>
          <button><i className="fas fa-forward" /></button>
        </PlaybackControls>
        <span style={{ fontSize: '0.75rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Phase 2 Media Console</span>
      </div>
    </Container>
  );
}
