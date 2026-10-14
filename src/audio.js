import { clipPaths } from './data/scenes';
import { createClipPlayer } from './clip-player';

const clips = createClipPlayer();
export const stopClip = clips.stop;
export function playClip(name, enabled) {
  clips.play(clipPaths[name], enabled);
}
