import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildSceneTimeline, sceneIndexAt } from '../src/data/sceneTimeline.js';

const timing = JSON.parse(readFileSync(new URL('../manifest_timing_audio.json', import.meta.url), 'utf8'));

test('each spoken color has one different scene at its exact audio timestamp', () => {
  const scenes = buildSceneTimeline(timing);
  assert.equal(scenes.length, 9);
  assert.deepEqual(scenes.slice(1, 4).map(s => s.text), ['Roșu', 'Verde', 'Gălbior']);
  assert.deepEqual(scenes.slice(1, 4).map(s => s.start),
    timing.fragments.slice(2, 5).map(f => f.start_sec));
  assert.equal(sceneIndexAt(scenes, 5.995), 1);
  assert.equal(sceneIndexAt(scenes, 8.131), 2);
  assert.equal(sceneIndexAt(scenes, 10.424), 3);
  assert.equal(sceneIndexAt(scenes, 13.017), 4);
  assert.equal(sceneIndexAt(scenes, 26.575), 8);
  assert.equal(sceneIndexAt(scenes, 0), -1);
});

test('screens cover the entire narration without gaps or overlaps', () => {
  const scenes = buildSceneTimeline(timing);
  assert.equal(scenes[0].start, timing.scenes[1].start_sec);
  assert.equal(scenes.at(-1).end, timing.total_duration_sec);
  for (let index = 0; index < scenes.length - 1; index++) {
    assert.equal(scenes[index].end, scenes[index + 1].start);
    assert.ok(scenes[index].end > scenes[index].start);
  }
});
