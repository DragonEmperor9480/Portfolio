/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useRef, useCallback } from 'react';
import stationsData from '../data/music.json';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [volume, setVolumeState] = useState(40);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentVideoData, setCurrentVideoData] = useState({ title: '', author: '' });
  const playerRef = useRef(null); // shared YT player instance

  const [stations, setStations] = useState(stationsData);

  // Set volume both in state and on the YT player (if ready)
  const setVolume = useCallback((val) => {
    const clamped = Math.max(0, Math.min(100, val));
    setVolumeState(clamped);
    if (playerRef.current?.setVolume) {
      playerRef.current.setVolume(clamped);
    }
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        volume,
        setVolume,
        playerRef,
        stations,
        setStations,
        currentIdx,
        setCurrentIdx,
        isPlaying,
        setIsPlaying,
        isReady,
        setIsReady,
        currentVideoData,
        setCurrentVideoData,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used inside <PlayerProvider>');
  return ctx;
}
