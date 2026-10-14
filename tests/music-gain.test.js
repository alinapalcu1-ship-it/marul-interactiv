import test from 'node:test';
import assert from 'node:assert/strict';
import { createMusicGain } from '../src/games/music-gain.js';

test('mobile gain is unlocked only by a gesture and ducks then restores the music', () => {
  let created = 0, resumed = 0, closed = 0;
  const changes = [];
  class FakeContext {
    currentTime = 10;
    destination = {};
    constructor() { created++; }
    createMediaElementSource(track) {
      assert.equal(track.volume, .14);
      return { connect() {}, disconnect() {} };
    }
    createGain() {
      return { gain: {
        value: .14,
        cancelScheduledValues: now => changes.push(['cancel', now]),
        setValueAtTime: (value, now) => changes.push(['set', value, now]),
        linearRampToValueAtTime: (value, when) => changes.push(['ramp', value, when]),
      }, connect() {}, disconnect() {} };
    }
    resume() { resumed++; return Promise.resolve(); }
    close() { closed++; return Promise.resolve(); }
  }
  const track = { volume: .14 };
  const music = createMusicGain(track, FakeContext);
  assert.equal(created, 0);
  music.unlock();
  assert.equal(created, 1);
  assert.equal(track.volume, 1);
  music.to(.025, 300);
  assert.deepEqual(changes.at(-1), ['ramp', .025, 10.3]);
  music.to(.14, 800);
  assert.deepEqual(changes.at(-1), ['ramp', .14, 10.8]);
  music.unlock();
  assert.equal(created, 1);
  assert.equal(resumed, 2);
  music.dispose();
  assert.equal(closed, 1);
});
