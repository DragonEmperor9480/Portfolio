/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../../context/PlayerContext';
import { useTheme } from '../../context/ThemeContext';
import { themes } from '../../themes/themes';

/* ═══════════════════════════════════════════════════════════════════════
   KEYFRAMES
═══════════════════════════════════════════════════════════════════════ */

const barUp = keyframes`
  0%, 100% { transform: scaleY(0.12); }
  50%       { transform: scaleY(1); }
`;

const ringPulse = keyframes`
  0%   { transform: scale(0.98); opacity: 0.7; }
  100% { transform: scale(1.06); opacity: 0; }
`;

/* ═══════════════════════════════════════════════════════════════════════
   SHELL & BACKGROUND
═══════════════════════════════════════════════════════════════════════ */

const Shell = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  background: #07070d;
  color: #eaeaf2;
  font-family: 'DM Mono', 'Fira Code', monospace;
  overflow: hidden;
  position: relative;
`;

/* Blurred album art used as ambient background — like Apple Music */
const AmbientBg = styled.div`
  position: absolute;
  inset: -5%;
  z-index: 0;
  pointer-events: none;
  background-image: url(${({ $src }) => $src || 'none'});
  background-size: cover;
  background-position: center;
  filter: blur(55px) saturate(2) brightness(0.22);
  transition: background-image 1.4s ease;
  will-change: filter;
`;

const DarkOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(
    160deg,
    rgba(7,7,13,0.72) 0%,
    rgba(7,7,13,0.45) 50%,
    rgba(7,7,13,0.78) 100%
  );
`;

/* ═══════════════════════════════════════════════════════════════════════
   HEADER
═══════════════════════════════════════════════════════════════════════ */

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px 8px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  flex-shrink: 0;
  position: relative;
  z-index: 3;
  background: rgba(7,7,13,0.45);
  backdrop-filter: blur(12px);
`;

const HeaderTitle = styled.span`
  font-size: 0.55rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: ${({ $p }) => $p};
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.5rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
`;

const Dot = styled.div`
  width: 5px; height: 5px;
  border-radius: 50%;
  background: ${({ $p, $on }) => $on ? $p : 'rgba(255,255,255,0.18)'};
  box-shadow: ${({ $p, $on }) => $on ? `0 0 7px ${$p}` : 'none'};
  transition: background 0.4s, box-shadow 0.4s;
`;

/* ═══════════════════════════════════════════════════════════════════════
   BODY (two-column)
═══════════════════════════════════════════════════════════════════════ */

const Body = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  position: relative;
  z-index: 2;
`;

/* ═══════════════════════════════════════════════════════════════════════
   LEFT: PLAYER COLUMN
═══════════════════════════════════════════════════════════════════════ */

const PlayerCol = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 14px 20px 18px;
  gap: 14px;
  min-width: 0;
  overflow: hidden;
`;

/* ─── Album Art ──────────────────────────────────────────────────────── */

const ArtWrap = styled.div`
  position: relative;
  width: min(100%, 200px);
  aspect-ratio: 1;
  flex-shrink: 0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.07),
    0 28px 70px -14px rgba(0,0,0,0.95),
    0 0 70px -22px ${({ $p }) => $p}55;
  transition: box-shadow 0.9s ease;
`;

const ArtImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform: ${({ $playing }) => $playing ? 'scale(1.05)' : 'scale(1.0)'};
  transition: transform 6s ease;
`;

const ArtFallback = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0f0f1e 0%, #1a1a32 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  i {
    font-size: 2.8rem;
    color: ${({ $p }) => $p};
    opacity: 0.25;
  }
`;

/* Bottom gradient inside art */
const ArtGrad = styled.div`
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 50%;
  background: linear-gradient(to top, rgba(7,7,13,0.88) 0%, transparent 100%);
  pointer-events: none;
  z-index: 1;
`;

/* EQ bars overlaid at bottom of art — the money shot */
const ArtEqRow = styled.div`
  position: absolute;
  bottom: 6px; left: 10px; right: 10px;
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 30px;
  z-index: 2;
`;

const ArtEqBar = styled.div`
  flex: 1;
  border-radius: 2px 2px 0 0;
  transform-origin: bottom;
  background: ${({ $p }) => `linear-gradient(to top, ${$p}ff, ${$p}33)`};
  box-shadow: 0 0 5px ${({ $p }) => $p}55;
  animation-name: ${({ $active }) => $active ? css`${barUp}` : 'none'};
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  height: 100%;
  opacity: ${({ $active }) => $active ? 0.9 : 0.18};
  transition: opacity 0.55s ease;
`;

/* Pulsing ring glow when playing */
const ArtRing = styled.div`
  position: absolute;
  inset: -3px;
  border-radius: 17px;
  border: 2px solid ${({ $p }) => $p}70;
  pointer-events: none;
  z-index: 3;
  animation: ${({ $playing }) => $playing ? css`${ringPulse} 2.2s ease-out infinite` : 'none'};
`;

/* ─── Track Info ─────────────────────────────────────────────────────── */

const TrackInfo = styled(motion.div)`
  text-align: center;
  width: 100%;
  max-width: 300px;
  flex-shrink: 0;
`;

const TrackName = styled.h3`
  font-family: 'Outfit', sans-serif;
  font-size: clamp(0.88rem, 2.5vw, 1.1rem);
  font-weight: 700;
  margin: 0 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #fff;
  letter-spacing: -0.1px;
`;

const TrackArtist = styled.p`
  font-size: 0.6rem;
  margin: 0;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: ${({ $p }) => $p};
  opacity: 0.82;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/* ─── Progress Bar ───────────────────────────────────────────────────── */

const ProgressSection = styled.div`
  width: 100%;
  max-width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const TimeRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.55rem;
  color: rgba(255,255,255,0.28);
  font-family: 'DM Mono', monospace;
  letter-spacing: 0.3px;
`;

/* Entirely DOM-ref driven — zero React state for progress */
const ProgressTrack = styled.div`
  width: 100%;
  height: 3px;
  background: rgba(255,255,255,0.09);
  border-radius: 3px;
  position: relative;
  cursor: pointer;
  touch-action: none;

  &:hover .prog-thumb {
    transform: translateY(-50%) scale(1.5);
    opacity: 1;
  }
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: 3px;
  background: ${({ $p }) => `linear-gradient(to right, ${$p}88, ${$p})`};
  box-shadow: 0 0 8px ${({ $p }) => $p}50;
  width: 0%;
  position: relative;
  pointer-events: none;
`;

const ProgressThumb = styled.div`
  position: absolute;
  right: -5px; top: 50%;
  transform: translateY(-50%) scale(0.7);
  width: 10px; height: 10px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 5px rgba(0,0,0,0.5);
  opacity: 0;
  transition: transform 0.15s, opacity 0.15s;
  pointer-events: none;
`;

/* ─── Playback Controls ──────────────────────────────────────────────── */

const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-shrink: 0;
`;

const CtrlBtn = styled.button`
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.09);
  color: rgba(255,255,255,0.5);
  cursor: pointer;
  font-size: 0.78rem;
  width: 36px; height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  transition: all 0.18s ease;
  flex-shrink: 0;

  &:hover { color: #fff; background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.2); }
  &:active { transform: scale(0.88); }
  &:disabled { opacity: 0.18; cursor: not-allowed; }
`;

const PlayBtn = styled.button`
  background: ${({ $p }) => $p};
  border: none;
  color: #000;
  cursor: pointer;
  font-size: 1rem;
  width: 52px; height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  box-shadow: 0 0 28px ${({ $p }) => $p}70, 0 6px 22px rgba(0,0,0,0.55);
  transition: box-shadow 0.3s, transform 0.15s;
  flex-shrink: 0;

  &:hover { box-shadow: 0 0 42px ${({ $p }) => $p}99, 0 8px 26px rgba(0,0,0,0.6); transform: scale(1.06); }
  &:active { transform: scale(0.91); }
  &:disabled { opacity: 0.25; cursor: not-allowed; }
`;

/* ─── Volume ─────────────────────────────────────────────────────────── */

const VolumeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-width: 240px;
  flex-shrink: 0;

  i { font-size: 0.64rem; color: rgba(255,255,255,0.28); width: 13px; text-align: center; }
`;

/* CSS custom property controls gradient — no re-render needed */
const VolSlider = styled.input`
  -webkit-appearance: none;
  flex: 1;
  height: 3px;
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  background: linear-gradient(
    to right,
    ${({ $p }) => $p}99 var(--vol-pct, 40%),
    rgba(255,255,255,0.1) var(--vol-pct, 40%)
  );

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 11px; height: 11px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    box-shadow: 0 0 4px rgba(0,0,0,0.4);
  }
`;

const VolLabel = styled.span`
  font-size: 0.55rem;
  color: rgba(255,255,255,0.25);
  width: 24px;
  text-align: right;
`;

/* ═══════════════════════════════════════════════════════════════════════
   RIGHT: QUEUE PANEL
═══════════════════════════════════════════════════════════════════════ */

const QueuePanel = styled.div`
  width: 168px;
  flex-shrink: 0;
  border-left: 1px solid rgba(255,255,255,0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  z-index: 2;
  background: rgba(7,7,13,0.32);
  backdrop-filter: blur(8px);
`;

const QueueHeader = styled.div`
  padding: 11px 13px 8px;
  font-size: 0.5rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.26);
  border-bottom: 1px solid rgba(255,255,255,0.04);
  flex-shrink: 0;
`;

const QueueScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 5px 0;

  &::-webkit-scrollbar { width: 2px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 1px; }
`;

const QueueItem = styled.button`
  width: 100%;
  background: ${({ $active }) => $active ? 'rgba(255,255,255,0.07)' : 'transparent'};
  border: none;
  border-left: 2px solid ${({ $active, $p }) => $active ? $p : 'transparent'};
  color: ${({ $active }) => $active ? '#fff' : 'rgba(255,255,255,0.38)'};
  padding: 7px 11px;
  cursor: pointer;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 2px;
  outline: none;
  transition: all 0.18s ease;

  &:hover {
    background: rgba(255,255,255,0.05);
    color: rgba(255,255,255,0.75);
    border-left-color: ${({ $p }) => $p}77;
  }
`;

const QueueThumb = styled.div`
  width: 100%;
  height: 66px;
  border-radius: 7px;
  overflow: hidden;
  margin-bottom: 5px;
  background: #101020;
  position: relative;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    opacity: ${({ $active }) => $active ? 0.92 : 0.5};
    transition: opacity 0.25s;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%);
  }
`;

const QueueName = styled.span`
  font-family: 'Outfit', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
`;

const QueueArtist = styled.span`
  font-size: 0.52rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  opacity: 0.5;
  display: block;
`;

const NowPlayingBars = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 10px;
  margin-top: 3px;
`;

const NPBar = styled.div`
  width: 2.5px;
  border-radius: 1px;
  background: ${({ $p }) => $p};
  animation: ${({ $d }) => css`${barUp} ${$d}s ease-in-out infinite alternate`};
  height: 10px;
`;

/* ═══════════════════════════════════════════════════════════════════════
   OFFLINE SCREEN
═══════════════════════════════════════════════════════════════════════ */

const Offline = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 14px;
  color: rgba(255,255,255,0.26);
  font-size: 0.7rem;
  text-align: center;
  padding: 24px;
  position: relative;
  z-index: 2;

  i { font-size: 2.2rem; opacity: 0.14; }
  p { margin: 0; line-height: 1.8; }
  code {
    font-size: 0.6rem;
    background: rgba(255,255,255,0.07);
    padding: 2px 7px;
    border-radius: 4px;
    letter-spacing: 1px;
  }
`;

/* ═══════════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════════ */

const fmt = (s) => {
  if (!s || isNaN(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? '0' : ''}${sec}`;
};

/* 28 EQ bars with staggered timing — pure CSS, zero JS */
const EQ_BARS = Array.from({ length: 28 }, (_, i) => ({
  dur: (0.34 + (i % 7) * 0.08).toFixed(2),
  del: (-(i % 9) * 0.055).toFixed(2),
}));

/* ═══════════════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════════════ */

export default function MusicApp() {
  const {
    volume, setVolume,
    playerRef, stations,
    currentIdx, setCurrentIdx,
    isPlaying, isReady,
    currentVideoData, setCurrentVideoData,
  } = usePlayer();

  const { currentTheme } = useTheme();
  const primary = themes[currentTheme]?.colors?.primary || '#64ffda';

  /* React state — only for what truly needs a re-render */
  const [imgErrors, setImgErrors] = useState({});
  const [trackKey, setTrackKey]   = useState(0);

  /* DOM refs — mutated directly in RAF loop, never triggers re-renders */
  const fillRef     = useRef(null);
  const elapsedRef  = useRef(null);
  const totalRef    = useRef(null);
  const thumbRef    = useRef(null);
  const volSlider   = useRef(null);
  const volLabel    = useRef(null);
  const rafId       = useRef(null);
  const trackRef    = useRef(null);
  const isDragging  = useRef(false);
  const dragTime    = useRef(0);
  const durationRef = useRef(0);

  /* Derived values — computed once per render */
  const currentId   = stations[currentIdx]?.id || '';
  const trackTitle  = (currentVideoData.title  || stations[currentIdx]?.name  || 'Unknown Track')
    .replace(/\.SH|\.WAV/g, '').replace(/_/g, ' ');
  const trackAuthor = currentVideoData.author || stations[currentIdx]?.genre || '—';
  const thumbUrl    = currentId && !imgErrors[currentId]
    ? `https://img.youtube.com/vi/${currentId}/hqdefault.jpg`
    : null;

  /* ── RAF loop: update progress bar directly in DOM ── */
  useEffect(() => {
    const tick = () => {
      rafId.current = requestAnimationFrame(tick);
      const p = playerRef.current;
      if (!p || typeof p.getPlayerState !== 'function') return;
      let cur = 0;
      if (!isDragging.current && typeof p.getCurrentTime === 'function') {
        cur = p.getCurrentTime() || 0;
        dragTime.current = cur;
      } else {
        cur = dragTime.current;
      }
      if (typeof p.getDuration === 'function') durationRef.current = p.getDuration() || 0;
      const pct = durationRef.current > 0 ? (cur / durationRef.current) * 100 : 0;
      if (fillRef.current)    fillRef.current.style.width = `${pct}%`;
      if (elapsedRef.current) elapsedRef.current.textContent = fmt(cur);
      if (totalRef.current && durationRef.current > 0) totalRef.current.textContent = fmt(durationRef.current);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current); };
  }, [playerRef]);

  /* ── Sync volume slider gradient via CSS custom prop ── */
  useEffect(() => {
    if (volSlider.current) volSlider.current.style.setProperty('--vol-pct', `${volume}%`);
    if (volLabel.current)  volLabel.current.textContent = `${volume}%`;
  }, [volume]);

  /* ── Reset on track change ── */
  useEffect(() => {
    durationRef.current = 0;
    dragTime.current    = 0;
    if (fillRef.current)    fillRef.current.style.width = '0%';
    if (elapsedRef.current) elapsedRef.current.textContent = '0:00';
    if (totalRef.current)   totalRef.current.textContent  = '0:00';
    setTrackKey(k => k + 1);
  }, [currentIdx]);

  /* ── Playback controls ── */
  const handlePlayPause = useCallback(() => {
    const p = playerRef.current;
    if (!p || !isReady) return;
    p.getPlayerState() === 1 ? p.pauseVideo() : p.playVideo();
  }, [playerRef, isReady]);

  const selectTrack = useCallback((idx) => {
    const p = playerRef.current;
    if (!p || !isReady) return;
    setCurrentIdx(idx);
    setCurrentVideoData({ title: '', author: '' });
    p.loadVideoById(stations[idx].id);
  }, [playerRef, isReady, stations, setCurrentIdx, setCurrentVideoData]);

  const handleNext = useCallback(
    () => selectTrack((currentIdx + 1) % stations.length),
    [selectTrack, currentIdx, stations.length]
  );
  const handlePrev = useCallback(
    () => selectTrack((currentIdx - 1 + stations.length) % stations.length),
    [selectTrack, currentIdx, stations.length]
  );

  /* ── Smooth pointer-based seeking ── */
  const getSeekTime = useCallback((clientX) => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) * (durationRef.current || 0);
  }, []);

  const handleProgressPointerDown = useCallback((e) => {
    e.preventDefault();
    isDragging.current = true;
    if (thumbRef.current) { thumbRef.current.style.transform = 'translateY(-50%) scale(1.5)'; thumbRef.current.style.opacity = '1'; }
    trackRef.current?.setPointerCapture?.(e.pointerId);

    const update = (ev) => {
      const t = getSeekTime(ev.clientX);
      dragTime.current = t;
      if (fillRef.current) fillRef.current.style.width = `${durationRef.current > 0 ? (t / durationRef.current) * 100 : 0}%`;
      if (elapsedRef.current) elapsedRef.current.textContent = fmt(t);
    };
    const commit = (ev) => {
      isDragging.current = false;
      if (thumbRef.current) { thumbRef.current.style.transform = 'translateY(-50%) scale(0.7)'; thumbRef.current.style.opacity = '0'; }
      const t = getSeekTime(ev.clientX);
      dragTime.current = t;
      if (playerRef.current && isReady) playerRef.current.seekTo(t, true);
      trackRef.current?.releasePointerCapture?.(e.pointerId);
    };
    update(e);
    trackRef.current?.addEventListener('pointermove', update);
    trackRef.current?.addEventListener('pointerup', commit, { once: true });
    trackRef.current?.addEventListener('pointercancel', commit, { once: true });
  }, [getSeekTime, playerRef, isReady]);

  /* ── Volume: CSS custom prop, no re-render ── */
  const handleVolChange = useCallback((e) => {
    const v = +e.target.value;
    e.target.style.setProperty('--vol-pct', `${v}%`);
    if (volLabel.current) volLabel.current.textContent = `${v}%`;
    setVolume(v);
  }, [setVolume]);

  /* ── Offline screen ── */
  if (!playerRef.current || typeof playerRef.current.getPlayerState !== 'function') {
    return (
      <Shell>
        <AmbientBg $src={thumbUrl} />
        <DarkOverlay />
        <Offline>
          <i className="fas fa-satellite-dish" />
          <p>No audio session active.<br />Open <code>MEDIA.EXE</code> in the navbar first.</p>
        </Offline>
      </Shell>
    );
  }

  return (
    <Shell>
      {/* Blurred thumbnail background — Apple Music style ambient */}
      <AmbientBg $src={thumbUrl} />
      <DarkOverlay />

      {/* Header */}
      <Header>
        <HeaderTitle $p={primary}>◈ SYS_AUDIO</HeaderTitle>
        <StatusBadge>
          <Dot $p={primary} $on={isPlaying} />
          {isPlaying ? 'streaming' : 'standby'}
        </StatusBadge>
      </Header>

      <Body>
        {/* ── Player column ── */}
        <PlayerCol>

          {/* Album Art with EQ inside */}
          <ArtWrap $p={primary}>
            {thumbUrl ? (
              <ArtImg
                src={thumbUrl}
                alt={trackTitle}
                $playing={isPlaying}
                onError={() => setImgErrors(e => ({ ...e, [currentId]: true }))}
              />
            ) : (
              <ArtFallback $p={primary}>
                <i className="fas fa-music" />
              </ArtFallback>
            )}

            {/* Bottom gradient inside art */}
            <ArtGrad />

            {/* EQ bars embedded at bottom of art */}
            <ArtEqRow>
              {EQ_BARS.map(({ dur, del }, i) => (
                <ArtEqBar
                  key={i}
                  $p={primary}
                  $active={isPlaying}
                  style={{ animationDuration: `${dur}s`, animationDelay: `${del}s` }}
                />
              ))}
            </ArtEqRow>

            {/* Pulsing ring when playing */}
            <ArtRing $p={primary} $playing={isPlaying} />
          </ArtWrap>

          {/* Track info — re-renders only on track change */}
          <AnimatePresence mode="wait">
            <TrackInfo
              key={trackKey}
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.26, ease: 'easeOut' }}
            >
              <TrackName>{trackTitle}</TrackName>
              <TrackArtist $p={primary}>{trackAuthor}</TrackArtist>
            </TrackInfo>
          </AnimatePresence>

          {/* Progress bar — RAF driven, no React state */}
          <ProgressSection>
            <TimeRow>
              <span ref={elapsedRef}>0:00</span>
              <span ref={totalRef}>0:00</span>
            </TimeRow>
            <ProgressTrack ref={trackRef} onPointerDown={handleProgressPointerDown}>
              <ProgressFill ref={fillRef} $p={primary}>
                <ProgressThumb ref={thumbRef} className="prog-thumb" />
              </ProgressFill>
            </ProgressTrack>
          </ProgressSection>

          {/* Playback controls */}
          <ControlsRow>
            <CtrlBtn onClick={handlePrev} disabled={!isReady} title="Previous">
              <i className="fas fa-step-backward" />
            </CtrlBtn>
            <PlayBtn $p={primary} onClick={handlePlayPause} disabled={!isReady}
              title={isPlaying ? 'Pause' : 'Play'}>
              <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`}
                style={{ marginLeft: isPlaying ? 0 : '2px' }} />
            </PlayBtn>
            <CtrlBtn onClick={handleNext} disabled={!isReady} title="Next">
              <i className="fas fa-step-forward" />
            </CtrlBtn>
          </ControlsRow>

          {/* Volume */}
          <VolumeRow>
            <i className={`fas fa-volume-${volume === 0 ? 'mute' : volume < 50 ? 'down' : 'up'}`} />
            <VolSlider
              ref={volSlider}
              type="range" min="0" max="100"
              defaultValue={volume}
              $p={primary}
              onChange={handleVolChange}
              style={{ '--vol-pct': `${volume}%` }}
            />
            <VolLabel ref={volLabel}>{volume}%</VolLabel>
          </VolumeRow>

        </PlayerCol>

        {/* ── Queue panel ── */}
        <QueuePanel>
          <QueueHeader>Queue</QueueHeader>
          <QueueScroll>
            {stations.map((s, idx) => {
              const active = idx === currentIdx;
              const hasErr = imgErrors[s.id];
              return (
                <QueueItem
                  key={s.id}
                  $active={active}
                  $p={primary}
                  onClick={() => selectTrack(idx)}
                  title={s.name}
                >
                  <QueueThumb $active={active}>
                    {!hasErr ? (
                      <img
                        src={`https://img.youtube.com/vi/${s.id}/mqdefault.jpg`}
                        alt={s.name}
                        onError={() => setImgErrors(e => ({ ...e, [s.id]: true }))}
                      />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', background: '#101020',
                      }}>
                        <i className="fas fa-music"
                          style={{ color: primary, opacity: 0.22, fontSize: '0.85rem' }} />
                      </div>
                    )}
                  </QueueThumb>
                  <QueueName>{s.name}</QueueName>
                  <QueueArtist>{s.genre}</QueueArtist>
                  {active && isPlaying && (
                    <NowPlayingBars>
                      {[0.34, 0.52, 0.40, 0.60].map((d, i) => (
                        <NPBar key={i} $p={primary} $d={d} />
                      ))}
                    </NowPlayingBars>
                  )}
                </QueueItem>
              );
            })}
          </QueueScroll>
        </QueuePanel>
      </Body>
    </Shell>
  );
}
