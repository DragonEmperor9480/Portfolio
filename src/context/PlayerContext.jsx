import { createContext, useContext, useState, useRef, useCallback } from 'react';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [volume, setVolumeState] = useState(40);
  const playerRef = useRef(null); // shared YT player instance

  // Set volume both in state and on the YT player (if ready)
  const setVolume = useCallback((val) => {
    const clamped = Math.max(0, Math.min(100, val));
    setVolumeState(clamped);
    if (playerRef.current?.setVolume) {
      playerRef.current.setVolume(clamped);
    }
  }, []);

  return (
    <PlayerContext.Provider value={{ volume, setVolume, playerRef }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used inside <PlayerProvider>');
  return ctx;
}
