// Cancel the previous transition before changing target: rapid taps never stack fades.
export function createVolumeFader(track, clock = {
  now: () => performance.now(), request: callback => requestAnimationFrame(callback),
  cancel: id => cancelAnimationFrame(id),
}) {
  let frame;
  function cancel() {
    if (frame !== undefined) { clock.cancel(frame); frame = undefined; }
  }
  function to(target, duration = 750) {
    cancel();
    const from = track.volume, start = clock.now();
    function step(now) {
      const progress = Math.min(1, (now - start) / duration);
      track.volume = from + (target - from) * progress;
      if (progress < 1) frame = clock.request(step);
    }
    frame = clock.request(step);
  }
  return { to, cancel };
}
