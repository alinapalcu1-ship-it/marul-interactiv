import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/games/games.css', import.meta.url), 'utf8');
const puzzle = readFileSync(new URL('../src/games/PuzzleGame.jsx', import.meta.url), 'utf8');

test('puzzle layout keeps both assembled image and loose tray in one phone viewport', () => {
  const rule = css.slice(css.lastIndexOf('/* Puzzle on phone: board AND loose-piece tray'));
  assert.match(rule, /grid-template-rows:\s*53% 42%/);
  assert.match(rule, /\.game-puzzle-active \.puzzle-area[\s\S]*?overflow:\s*hidden;/);
  assert.match(rule, /\.game-puzzle-active \.puzzle-board[\s\S]*?height:\s*min\(92cqw, 53cqh\)/);
  assert.match(rule, /\.game-puzzle-active \.puzzle-tray[\s\S]*?height:\s*min\(88cqw, 42cqh\)/);
  assert.ok(!rule.includes('overflow-y: auto'), 'puzzle must not hide pieces below a scroll area');
  assert.ok(!puzzle.includes('scrollTo('), 'no auto-scrolling that hides the board or tray');
  assert.match(css, /\.puzzle-horizontal \.puzzle-tray[\s\S]*?grid-template-rows: repeat\(var\(--pieces\), minmax\(0, 1fr\)\)/);
});
