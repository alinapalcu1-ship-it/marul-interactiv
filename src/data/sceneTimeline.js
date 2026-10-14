// The 29-second original audio stays untouched; each word's start is exact.
const descriptors = [
  [1, 'Mărul este rotunjor'],
  [2, 'Roșu'],
  [3, 'Verde'],
  [4, 'Gălbior'],
  [5, 'Parcă-i minge'],
  [6, 'Dar nu sare'],
  [7, 'Și codiță mică are'],
  [8, 'Parfumat, dar și gustos'],
  [10, 'El mă face sănătos!'],
];
export function buildSceneTimeline(timing) {
  return descriptors.map(([fragment, text], index) => ({
    text,
    start: timing.fragments[fragment].start_sec,
    end: index + 1 < descriptors.length
      ? timing.fragments[descriptors[index + 1][0]].start_sec
      : timing.total_duration_sec,
  }));
}
export function sceneIndexAt(scenes, time) {
  return scenes.findLastIndex(scene => time >= scene.start);
}
