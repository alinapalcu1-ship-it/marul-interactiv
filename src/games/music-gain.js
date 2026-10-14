import { createVolumeFader } from './volume-fader.js';

// iOS Safari ignores changes to HTMLMediaElement.volume. Route the music through
// Web Audio's GainNode once the child taps a game, keeping the narration separate.
export function createMusicGain(track, AudioContextClass) {
  const fallback = createVolumeFader(track);
  let context = null;
  let source = null;
  let gain = null;
  let target = track.volume;

  function unlock() {
    if (!context) {
      const Ctor = AudioContextClass || (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext));
      if (Ctor) {
        try {
          context = new Ctor();
          source = context.createMediaElementSource(track);
          gain = context.createGain();
          gain.gain.value = target;
          source.connect(gain);
          gain.connect(context.destination);
          fallback.cancel();
          // The GainNode now owns the audible volume on every platform.
          track.volume = 1;
        } catch {
          // Unsupported or blocked contexts fall back to the HTML audio fader.
          try { context?.close(); } catch { /* no-op */ }
          context = null;
          source = null;
          gain = null;
        }
      }
    }
    try { context?.resume()?.catch(() => {}); } catch { /* blocked until gesture */ }
  }

  function to(volume, duration = 750) {
    target = Math.max(0, Math.min(1, volume));
    if (gain && context) {
      const now = context.currentTime;
      const param = gain.gain;
      param.cancelScheduledValues(now);
      param.setValueAtTime(param.value, now);
      param.linearRampToValueAtTime(target, now + Math.max(duration, 1) / 1000);
    } else {
      fallback.to(target, duration);
    }
  }

  function cancel() {
    fallback.cancel();
    if (gain && context) {
      const now = context.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
    }
  }

  function dispose() {
    cancel();
    try { source?.disconnect(); gain?.disconnect(); } catch { /* no-op */ }
    try { context?.close()?.catch(() => {}); } catch { /* no-op */ }
    context = null; source = null; gain = null;
  }

  return { unlock, to, cancel, dispose };
}
