import { buildSceneTimeline, sceneIndexAt } from './sceneTimeline';
import timing from '../../manifest_timing_audio.json';

// Relative URLs also work in a GitHub Pages repository subdirectory.
const base = import.meta.env.BASE_URL;
export const assets = {
  apple: 'apple-red', red: 'apple-red', green: 'apple-green', yellow: 'apple-yellow',
  ball: 'ball', stem: 'stem-leaf', scent: 'scent', heart: 'healthy-heart', girl: 'characters/girl-neutral', boy: 'characters/boy-neutral',
};
export const imagePath = key => base + 'assets/' + assets[key] + '.png';
export const audioPath = base + 'assets/audio-poem.mp3';
export const labels = { apple: 'Mărul', red: 'Roșu', green: 'Verde', yellow: 'Gălbior', ball: 'Mingea', stem: 'Codița', scent: 'Parfumul', heart: 'Sănătate', girl: 'Fetița', boy: 'Băiețelul' };

// Adjust timing in the supplied manifest, including the pauses between words.
export const scenes = buildSceneTimeline(timing);
export const introEnd = scenes[0].start;
export const duration = timing.total_duration_sec;
export const colorTimes = timing.fragments.slice(2, 5).map(fragment => fragment.start_sec);
export const tasteTime = timing.fragments[9].start_sec;
export function sceneAt(time) {
  return sceneIndexAt(scenes, time);
}
const fragmentIds = { apple: 1, red: 2, green: 3, yellow: 4, ball: 5, stem: 7, scent: 8, heart: 10 };
export const clipPaths = Object.fromEntries(Object.entries(fragmentIds).map(([name, index]) =>
  [name, base + 'assets/audio/' + timing.fragments[index].file]));


