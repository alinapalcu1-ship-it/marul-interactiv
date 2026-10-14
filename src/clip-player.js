// A single channel for game responses. Inject a factory for tests without audio hardware.
export function createClipPlayer(createAudio = url => new Audio(url)) {
  let current;
  function stop() {
    if (current) { current.pause(); current.currentTime = 0; current = null; }
  }
  function play(url, enabled) {
    stop();
    if (!enabled || !url) return;
    current = createAudio(url);
    current.play().catch(() => { /* Animation remains usable if audio is unavailable. */ });
  }
  return { play, stop };
}
