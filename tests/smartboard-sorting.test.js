import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sortingApples } from '../src/games/logic.js';

const css = readFileSync(new URL('../src/games/games.css', import.meta.url), 'utf8');

test('final sorting game keeps four red and three yellow apples', () => {
  const apples = sortingApples(() => .4);
  assert.equal(apples.filter(a => a.color === 'red').length, 4);
  assert.equal(apples.filter(a => a.color === 'yellow').length, 3);
});

test('large-screen basket layout reveals both rows above the front rim', () => {
  const section = css.slice(css.lastIndexOf('/* SMART BOARD / DESKTOP:'));
  assert.match(section, /@media \(min-width: 901px\)/);
  assert.match(section, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(section, /grid-template-rows: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(section, /top: 16%/);
  assert.match(section, /bottom: 37%/);
  assert.match(section, /clip-path: inset\(73% 0 0 0\)/);
  assert.match(section, /basket-yellow \.basket-apples img:nth-child\(3\)/);
});
