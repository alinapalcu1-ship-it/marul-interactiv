import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sortingApples } from '../src/games/logic.js';

const css = readFileSync(new URL('../src/games/games.css', import.meta.url), 'utf8');
const src = readFileSync(new URL('../src/games/SortingGame.jsx', import.meta.url), 'utf8');
const fix = css.slice(css.lastIndexOf('/* SMARTBOARD FIX 2:'));

test('sorting preserves all four red and three yellow apples', () => {
  const fruit = sortingApples(() => 0.5);
  assert.equal(fruit.filter(x => x.color === 'red').length, 4);
  assert.equal(fruit.filter(x => x.color === 'yellow').length, 3);
});

test('on smartboard fruit appears above basket artwork without a duplicate overlay', () => {
  assert.match(fix, /\.sorting-area \.sorting-basket \.basket-rim \{ display: none; \}/);
  assert.match(fix, /\.basket-image \{ z-index: 0; \}/);
  assert.match(fix, /\.basket-apples[\s\S]*?z-index: 10/);
  for (let i=1; i<=4; i++) {
    assert.ok(fix.includes('.basket-red .basket-apples img:nth-child('+i+')'), 'red apple '+i);
  }
  for (let i=1; i<=3; i++) {
    assert.ok(fix.includes('.basket-yellow .basket-apples img:nth-child('+i+')'), 'yellow apple '+i);
  }
  assert.match(src, /apples\.filter\(apple => apple\.color === color && placed\.includes\(apple\.id\)\)/);
});

test('smartboard positioning does not change portrait phone basket CSS', () => {
  assert.match(fix, /@media \(min-width: 901px\), \(min-width: 700px\) and \(min-height: 650px\) and \(orientation: landscape\)/);
});
