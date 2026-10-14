import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createClipPlayer } from '../src/clip-player.js';

test('rapid taps stop and rewind the previous clip before starting another', () => {
  const clips = [];
  const player = createClipPlayer(url => {
    const clip = { url, currentTime: 1, paused: true,
      play() { this.paused = false; return Promise.resolve(); },
      pause() { this.paused = true; },
    };
    clips.push(clip); return clip;
  });
  player.play('red.mp3', true);
  player.play('green.mp3', true);
  assert.equal(clips[0].paused, true);
  assert.equal(clips[0].currentTime, 0);
  assert.equal(clips.filter(clip => !clip.paused).length, 1);
  player.stop(); // Home / change mode
  assert.equal(clips[1].paused, true);
  assert.equal(clips[1].currentTime, 0);
  player.play('yellow.mp3', false);
  assert.equal(clips.length, 2);
});

test('an object without narration also cancels the previous response', () => {
  let pauses = 0;
  const player = createClipPlayer(() => ({ play: () => Promise.resolve(), pause: () => pauses++ }));
  player.play('red.mp3', true);
  player.play(undefined, true);
  assert.equal(pauses, 1);
});
