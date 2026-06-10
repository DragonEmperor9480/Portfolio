import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { usePlayer } from '../../context/PlayerContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(26, 15, 36, 0.95);
  font-family: 'Space Grotesk', sans-serif;
  color: ${({ theme }) => theme.colors.text};
  padding: 20px;
  box-sizing: border-box;
  justify-content: space-between;
  gap: 12px;
`;

const PlaybackCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid ${({ theme }) => theme.colors.primary}15;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  flex-grow: 1;
  justify-content: center;
`;

const AlbumArt = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  
  i {
    font-size: 2.2rem;
    color: ${({ theme }) => theme.colors.primary};
    filter: drop-shadow(0 0 8px ${({ theme }) => theme.colors.primary}80);
  }
`;

const TrackInfoText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 100%;
  
  h4 {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  span {
    font-size: 0.78rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const WaveformContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  height: 36px;
  width: 100%;
  margin-top: 4px;
`;

const WaveBar = styled.div`
  width: 3px;
  height: ${({ $height }) => $height}px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
  box-shadow: 0 0 6px ${({ theme }) => theme.colors.primary}30;
  transition: height 0.1s ease;
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-shrink: 0;
`;

const ProgressRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: monospace;
  font-size: 0.72rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ProgressSlider = styled.input`
  -webkit-appearance: none;
  flex-grow: 1;
  height: 3px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
  cursor: pointer;

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 3px;
    background: linear-gradient(
      to right, 
      ${({ theme }) => theme.colors.primary} 0%, 
      ${({ theme }) => theme.colors.primary} ${props => props.$pct}%, 
      rgba(255, 255, 255, 0.1) ${props => props.$pct}%, 
      rgba(255, 255, 255, 0.1) 100%
    );
    border-radius: 2px;
  }

  &::-webkit-slider-thumb {
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -3.5px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
  }
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;

  button {
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.colors.text};
    cursor: pointer;
    font-size: 1.1rem;
    transition: all 0.2s ease;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
      background: rgba(255, 255, 255, 0.03);
      transform: scale(1.08);
    }

    &:active {
      transform: scale(0.95);
    }

    &.play-btn {
      width: 44px;
      height: 44px;
      background: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.background};
      font-size: 0.95rem;

      &:hover {
        box-shadow: 0 0 15px ${({ theme }) => theme.colors.primary}60;
        color: ${({ theme }) => theme.colors.background};
      }
    }
  }
`;

const VolumeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 0 10px;

  i {
    width: 16px;
    text-align: center;
  }

  input {
    -webkit-appearance: none;
    flex-grow: 1;
    height: 3px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.1);
    outline: none;
    cursor: pointer;

    &::-webkit-slider-runnable-track {
      width: 100%;
      height: 3px;
      background: linear-gradient(
        to right, 
        ${({ theme }) => theme.colors.primary} 0%, 
        ${({ theme }) => theme.colors.primary} ${props => props.$pct}%, 
        rgba(255, 255, 255, 0.1) ${props => props.$pct}%, 
        rgba(255, 255, 255, 0.1) 100%
      );
      border-radius: 2px;
    }

    &::-webkit-slider-thumb {
      height: 10px;
      width: 10px;
      border-radius: 50%;
      background: #ffffff;
      cursor: pointer;
      -webkit-appearance: none;
      margin-top: -3.5px;
    }
  }
`;

const STATIONS = [
  { name: 'I Really Want to Stay at Your House', id: 'Rbgw_rduQpM', genre: 'Rosa Walton'  },
  { name: 'Distant Echoes',                      id: '87Nk5cVwD9A', genre: 'VXLLAIN'       },
  { name: 'Fainted',                             id: 'hLuhfSP8Odc', genre: 'Narvent'       },
];

export default function MusicApp() {
  const { volume, setVolume, playerRef } = usePlayer();
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackInfo, setTrackInfo] = useState({ title: 'Lo-Fi Audio Session', author: 'Stream Offline' });
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [barHeights, setBarHeights] = useState(Array(24).fill(4));

  const isSeekingRef = useRef(false);

  // Formatting minutes:seconds
  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Sync state loops from shared YT Player
  useEffect(() => {
    const interval = setInterval(() => {
      const player = playerRef.current;
      if (player && typeof player.getPlayerState === 'function') {
        const state = player.getPlayerState();
        setIsPlaying(state === 1); // 1 = playing

        const data = player.getVideoData();
        if (data && data.title) {
          setTrackInfo({ 
            title: data.title, 
            author: data.author || 'YouTube Audio Stream' 
          });
        }

        if (typeof player.getCurrentTime === 'function' && !isSeekingRef.current) {
          setCurrentTime(player.getCurrentTime() || 0);
        }
        if (typeof player.getDuration === 'function') {
          setDuration(player.getDuration() || 0);
        }
      } else {
        setIsPlaying(false);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [playerRef]);

  // Waveform dancing animation when playing
  useEffect(() => {
    if (!isPlaying) {
      setBarHeights(Array(24).fill(4));
      return;
    }

    const animInterval = setInterval(() => {
      setBarHeights(
        Array(24)
          .fill(0)
          .map(() => Math.floor(Math.random() * 26) + 6)
      );
    }, 100);

    return () => clearInterval(animInterval);
  }, [isPlaying]);

  const handlePlayPause = () => {
    const player = playerRef.current;
    if (!player || typeof player.getPlayerState !== 'function') return;
    const state = player.getPlayerState();
    if (state === 1) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  const handleNext = () => {
    const player = playerRef.current;
    if (!player || typeof player.loadVideoById !== 'function') return;
    const currentId = player.getVideoData()?.video_id;
    const idx = STATIONS.findIndex(s => s.id === currentId);
    const nextIdx = idx === -1 ? 0 : (idx + 1) % STATIONS.length;
    player.loadVideoById(STATIONS[nextIdx].id);
  };

  const handlePrev = () => {
    const player = playerRef.current;
    if (!player || typeof player.loadVideoById !== 'function') return;
    const currentId = player.getVideoData()?.video_id;
    const idx = STATIONS.findIndex(s => s.id === currentId);
    const prevIdx = idx === -1 ? 0 : (idx - 1 + STATIONS.length) % STATIONS.length;
    player.loadVideoById(STATIONS[prevIdx].id);
  };

  const handleProgressChange = (e) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
  };

  const handleProgressTouchStart = () => {
    isSeekingRef.current = true;
  };

  const handleProgressTouchEnd = (e) => {
    isSeekingRef.current = false;
    const player = playerRef.current;
    if (player && typeof player.seekTo === 'function') {
      player.seekTo(parseFloat(e.target.value), true);
    }
  };

  if (!playerRef.current || typeof playerRef.current.getPlayerState !== 'function') {
    return (
      <Container>
        <PlaybackCard>
          <AlbumArt>
            <i className="fas fa-compact-disc fa-spin" style={{ animationDuration: '4s' }} />
          </AlbumArt>
          <TrackInfoText style={{ marginTop: '12px' }}>
            <h4>Audio Session Inactive</h4>
            <span>Activate system audio in the top-right navbar control tray.</span>
          </TrackInfoText>
        </PlaybackCard>
      </Container>
    );
  }

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Container>
      <PlaybackCard>
        <AlbumArt>
          <i className={`fas fa-compact-disc ${isPlaying ? 'fa-spin' : ''}`} />
        </AlbumArt>
        
        <TrackInfoText>
          <h4>{trackInfo.title}</h4>
          <span>{trackInfo.author}</span>
        </TrackInfoText>

        <WaveformContainer>
          {barHeights.map((h, i) => (
            <WaveBar key={i} $height={h} />
          ))}
        </WaveformContainer>
      </PlaybackCard>

      <ControlsContainer>
        {/* Progress Timeline */}
        <ProgressRow>
          <span>{formatTime(currentTime)}</span>
          <ProgressSlider
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            $pct={progressPct}
            onChange={handleProgressChange}
            onMouseDown={handleProgressTouchStart}
            onMouseUp={handleProgressTouchEnd}
            onTouchStart={handleProgressTouchStart}
            onTouchEnd={handleProgressTouchEnd}
          />
          <span>{formatTime(duration)}</span>
        </ProgressRow>

        {/* Buttons */}
        <ButtonRow>
          <button onClick={handlePrev} title="Previous Station">
            <i className="fas fa-backward" />
          </button>
          <button onClick={handlePlayPause} className="play-btn" title={isPlaying ? 'Pause' : 'Play'}>
            <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`} style={{ marginLeft: isPlaying ? '0' : '3px' }} />
          </button>
          <button onClick={handleNext} title="Next Station">
            <i className="fas fa-forward" />
          </button>
        </ButtonRow>

        {/* Volume */}
        <VolumeRow $pct={volume}>
          <i className={`fas fa-volume-${volume === 0 ? 'mute' : volume < 55 ? 'low' : 'high'}`} />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(+e.target.value)}
            title="Mixer Volume"
          />
          <span style={{ fontSize: '0.7rem', width: '24px', textAlign: 'right', fontFamily: 'monospace' }}>{volume}%</span>
        </VolumeRow>
      </ControlsContainer>
    </Container>
  );
}
