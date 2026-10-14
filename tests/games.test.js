import { test } from 'node:test';
import assert from 'node:assert/strict';
import { characters, matchingRound, memoryDeck, matchingCards, sliceStyle, closeToSlot, sortingApples, canSort, largerBasket } from '../src/games/logic.js';

test('each matching level covers all characters and varies the correct position', () => {
  for (const level of [1, 2]) {
    const positions = new Set();
    for (let round = 0; round < 3; round++) {
      const { target, choices } = matchingRound(level, round);
      assert.equal(target, characters[round]);
      assert.equal(choices.length, level + 1);
      assert.equal(choices.filter(name => name === target).length, 1);
      assert.equal(new Set(choices).size, choices.length);
      positions.add(choices.indexOf(target));
    }
    assert.ok(positions.size > 1);
  }
});

test('memory contains exactly two cards per character and never pairs a card with itself', () => {
  for (const level of [1, 2]) {
    for (let run = 0; run < 20; run++) {
      const deck = memoryDeck(level);
      assert.equal(deck.length, level === 1 ? 4 : 6);
      assert.equal(new Set(deck.map(card => card.id)).size, deck.length);
      for (const name of characters.slice(0, level + 1)) {
        const indexes = deck.flatMap((card, index) => card.name === name ? [index] : []);
        assert.equal(indexes.length, 2);
        assert.equal(matchingCards(deck, indexes[0], indexes[1]), true);
        assert.equal(matchingCards(deck, indexes[0], indexes[0]), false);
      }
    }
  }
});

test('puzzle crops cover the source exactly for two and three pieces', () => {
  for (const count of [2, 3]) {
    for (let piece = 0; piece < count; piece++) {
      const style = sliceStyle(piece, count);
      assert.equal(parseFloat(style.width) / 100 / count, 1);
      assert.ok(Math.abs(-parseFloat(style.left) / 100 / count - piece / count) < 1e-12);
    }
  }
});

test('puzzle accepts a nearby correct slot, but not a distant drop', () => {
  const rect = { left: 100, top: 100, right: 200, bottom: 300, width: 100 };
  assert.equal(closeToSlot({ x: 90, y: 150 }, rect), true);
  assert.equal(closeToSlot({ x: 240, y: 150 }, rect), false);
});

test('sorting always has four red and three yellow apples, with the red basket larger', () => {
  for (let run = 0; run < 30; run++) {
    const apples = sortingApples();
    assert.equal(apples.length, 7);
    assert.equal(new Set(apples.map(apple => apple.id)).size, 7);
    assert.equal(apples.filter(apple => apple.color === 'red').length, 4);
    assert.equal(apples.filter(apple => apple.color === 'yellow').length, 3);
    assert.equal(largerBasket(apples), 'red');
    const placed = [];
    for (const apple of apples) {
      assert.equal(canSort(apple, apple.color === 'red' ? 'yellow' : 'red', placed), false);
      assert.equal(canSort(apple, apple.color, placed), true);
      placed.push(apple.id);
      assert.equal(canSort(apple, apple.color, placed), false);
    }
  }
});
