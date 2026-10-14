import test from 'node:test';
import assert from 'node:assert/strict';
import { createVolumeFader } from '../src/games/volume-fader.js';

test('music ducks smoothly, cancels old fades and restores the base volume', () => {
  let time = 0, nextId = 0;
  const frames = new Map();
  const track = { volume: .14 };
  const clock = { now: () => time, request: callback => { frames.set(++nextId, callback); return nextId; }, cancel: id => frames.delete(id) };
  function tick(ms) { time += ms; const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(callback => callback(time)); }
  const fade = createVolumeFader(track, clock);
  fade.to(.025, 300); tick(150);
  assert.ok(track.volume > .025 && track.volume < .14);
  fade.to(.14, 750);
  assert.equal(frames.size, 1);
  tick(750); assert.equal(track.volume, .14);
  fade.to(.025, 300); tick(300); assert.ok(Math.abs(track.volume - .025) < 1e-8);
  fade.to(.14); fade.cancel(); tick(900); assert.ok(Math.abs(track.volume - .025) < 1e-8);
});
