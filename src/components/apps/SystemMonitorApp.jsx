import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(10, 25, 47, 0.9);
  padding: 24px;
  box-sizing: border-box;
  font-family: 'Space Grotesk', sans-serif;
  color: ${({ theme }) => theme.colors.text};
  gap: 24px;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

const MetricCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid ${({ theme }) => theme.colors.primary}20;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  overflow: hidden;

  h4 {
    margin: 0;
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .value {
    font-size: 1.8rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
    font-family: 'IBM Plex Mono', monospace;
  }
`;

const ChartPlaceholder = styled.div`
  flex-grow: 1;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid ${({ theme }) => theme.colors.primary}10;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  min-height: 120px;
  position: relative;

  .grid-bg {
    position: absolute;
    inset: 0;
    background-size: 20px 20px;
    background-image: 
      linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
  }
`;

const PulseIndicator = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  box-shadow: 0 0 8px ${({ theme }) => theme.colors.primary};
`;

export default function SystemMonitorApp() {
  return (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PulseIndicator />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Diagnostics Active</span>
        </div>
        <span style={{ fontSize: '0.8rem', color: '#888', fontFamily: 'monospace' }}>PID: 4892</span>
      </div>

      <MetricsGrid>
        <MetricCard>
          <h4>CPU Utilisation</h4>
          <span className="value">14.8%</span>
        </MetricCard>
        <MetricCard>
          <h4>Memory Allocated</h4>
          <span className="value">2.41 GB</span>
        </MetricCard>
      </MetricsGrid>

      <ChartPlaceholder>
        <div className="grid-bg" />
        <i className="fas fa-chart-line" style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.15)' }} />
        <span style={{ fontSize: '0.85rem', color: '#888', zIndex: 1 }}>Metrics Graphing Core [Phase 2 Ready]</span>
      </ChartPlaceholder>
    </Container>
  );
}
