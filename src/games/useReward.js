import { useEffect, useRef } from 'react';

// A quiet, short two-note chime; one voice at a time, no downloaded sound service.
export default function useReward(sound, pauseMusic, resumeMusic) {
  const context = useRef(null);
  const active = useRef(null);
  const voice = useRef(null);
  function stop() {
    if (active.current) { try { active.current.stop(); } catch { /* Already ended. */ } active.current = null; }
    if (voice.current) { voice.current.pause(); voice.current.currentTime = 0; voice.current = null; }
    resumeMusic?.();
  }
  useEffect(() => { if (!sound) stop(); }, [sound]);
  useEffect(() => () => { stop(); context.current?.close(); }, []);
  return (kind = 'chime') => {
    stop();
    if (!sound) return;
    if (kind === 'bravo') {
      // Supplied recording; music pauses until the short response finishes.
      pauseMusic?.();
      voice.current = new Audio(import.meta.env.BASE_URL + 'assets/audio/bravo.mp3');
      voice.current.onended = () => resumeMusic?.();
      voice.current.onerror = () => resumeMusic?.();
      voice.current.play().catch(() => resumeMusic?.());
      return;
    }
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    context.current ||= new AudioContext();
    const ctx = context.current;
    ctx.resume().catch(() => {});
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523.25, now);
    oscillator.frequency.setValueAtTime(659.25, now + .18);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(.075, now + .035);
    gain.gain.exponentialRampToValueAtTime(.001, now + .48);
    oscillator.connect(gain); gain.connect(ctx.destination);
    oscillator.start(now); oscillator.stop(now + .5);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    active.current = oscillator;
  };
}
