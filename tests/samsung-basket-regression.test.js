import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sortingApples } from '../src/games/logic.js';

const css=readFileSync(new URL('../src/games/games.css', import.meta.url), 'utf8');
const latest=css.slice(css.lastIndexOf('/* SAMSUNG SMART BOARD'));

test('seven apples keep their true distribution',()=>{
  const apples=sortingApples(()=>0.2);
  assert.equal(apples.filter(a=>a.color==='red').length,4);
  assert.equal(apples.filter(a=>a.color==='yellow').length,3);
});

test('smartboard layout works even with narrowed CSS viewport and keeps portrait phone separate',()=>{
  assert.ok(latest.includes('@media (min-width: 901px), (orientation: landscape)'));
  assert.ok(latest.includes('.basket-rim {\n    display: none;'));
  assert.ok(latest.includes('z-index: 15'));
  assert.ok(latest.includes('display: block'));
  for(let i=1;i<=4;i++)assert.ok(latest.includes('.basket-red .basket-apples > img:nth-child('+i+')'));
  for(let i=1;i<=3;i++)assert.ok(latest.includes('.basket-yellow .basket-apples > img:nth-child('+i+')'));
  assert.ok(!latest.includes('max-width: 900px'), 'must not override portrait mobile');
});
