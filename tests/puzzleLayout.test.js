import { test } from 'node:test';
import assert from 'node:assert/strict';
import { measurePuzzlePanels } from '../src/games/puzzleLayout.js';

test('portrait phone has board and tray visible without vertical scrolling', () => {
  for (const [width,height] of [[360,450],[375,350],[390,400],[320,255],[430,560]]) {
    const layout=measurePuzzlePanels(width,height);
    assert.ok(layout.board>0 && layout.tray>0);
    assert.ok(layout.board+layout.tray+layout.gap<=height, 'panels fit available game height');
    assert.ok(layout.board<=width);
    assert.ok(layout.tray<=width);
  }
});

test('short portrait view places puzzle and loose pieces side by side', () => {
  const layout=measurePuzzlePanels(375,245);
  assert.equal(layout.sideBySide,true);
  assert.ok(layout.board+layout.tray+layout.gap<=375);
  assert.ok(Math.max(layout.board,layout.tray)<=245);
});

test('normal portrait view keeps large square pieces below the board', () => {
  const layout=measurePuzzlePanels(390,420);
  assert.equal(layout.sideBySide,false);
  assert.ok(layout.board>=200);
  assert.ok(layout.tray>=150);
});
