import { useCallback, useEffect, useRef } from 'react';
import { createMusicGain } from './music-gain';

// One manager owns all game audio. Replace the background MP3 without changing code.
export default function useGameAudio(sound, musicEnabled) {
  const music = useRef(null);
  const voice = useRef(null);
  const state = useRef({ sound, musicEnabled, frame: 0, queue: [], speaking: false });
  state.current.sound = sound;
  state.current.musicEnabled = musicEnabled;
  const fade = useCallback((target, duration = 750) => {
    if (!music.current) return;
    state.current.fader ||= createMusicGain(music.current);
    state.current.fader.to(target, duration);
  }, []);
  const resumeMusic = useCallback(() => {
    if (music.current) {
      state.current.fader ||= createMusicGain(music.current);
      state.current.fader.unlock();
    }
    if (!state.current.sound || !state.current.musicEnabled || document.hidden) return;
    music.current?.play().catch(() => {});
    fade(state.current.speaking ? .025 : .14);
  }, [fade]);
  const stopVoice = useCallback(() => {
    state.current.queue = []; state.current.speaking = false;
    try { state.current.oscillator?.stop(); } catch { /* Already finished. */ }
    if (voice.current) { voice.current.pause(); voice.current.currentTime = 0; }
    fade(.14);
  }, [fade]);
  const speak = useCallback((name, queue = false) => {
    if (!state.current.sound || document.hidden) return;
    if (queue && state.current.speaking) { state.current.queue.push(name); return; }
    const track = voice.current;
    if (!track) return;
    if (!queue) state.current.queue = [];
    track.pause(); state.current.speaking = true;
    track.src = import.meta.env.BASE_URL + 'assets/audio/' + name + '.mp3';
    fade(.025, 300);
    track.play().catch(() => { state.current.speaking = false; fade(.14); });
  }, [fade]);
  const finishVoice = useCallback(() => {
    state.current.speaking = false;
    const next = state.current.queue.shift();
    if (next) speak(next, true); else fade(.14);
  }, [speak, fade]);
  const reward = useCallback((kind = 'chime') => {
    if (kind === 'bravo') { speak('bravo', true); return; }
    if (!state.current.sound || state.current.speaking || document.hidden) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    state.current.context ||= new AudioContext();
    const context = state.current.context;
    context.resume().catch(() => {});
    try { state.current.oscillator?.stop(); } catch { /* Already finished. */ }
    const oscillator = context.createOscillator(), gain = context.createGain(), now = context.currentTime;
    oscillator.frequency.setValueAtTime(523, now); oscillator.frequency.setValueAtTime(659, now + .18);
    gain.gain.setValueAtTime(.05, now); gain.gain.exponentialRampToValueAtTime(.001, now + .45);
    oscillator.connect(gain); gain.connect(context.destination);
    oscillator.start(); oscillator.stop(now + .46);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    state.current.oscillator = oscillator;
  }, [speak]);
  useEffect(() => {
    const background = music.current, narration = voice.current;
    background.volume = 0;
    const visibility = () => {
      if (document.hidden) { background.pause(); narration.pause(); state.current.fader?.cancel(); }
      else { resumeMusic(); if (state.current.sound && state.current.speaking) narration.play().catch(() => {}); }
    };
    document.addEventListener('visibilitychange', visibility);
    return () => {
      document.removeEventListener('visibilitychange', visibility);
      state.current.fader?.dispose();
      background.pause(); narration.pause();
      background.currentTime = 0; narration.currentTime = 0;
      state.current.context?.close();
    };
  }, [resumeMusic]);
  useEffect(() => {
    if (!sound) stopVoice();
    if (sound && musicEnabled) resumeMusic();
    else { state.current.fader?.cancel(); music.current?.pause(); }
  }, [sound, musicEnabled, resumeMusic, stopVoice]);
  return { music, voice, speak, reward, stopVoice, resumeMusic, finishVoice };
}

