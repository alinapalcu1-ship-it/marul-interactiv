export const characters = ['apple', 'girl', 'boy'];
export const names = { apple: 'Mărul', girl: 'Fetița', boy: 'Băiețelul' };

export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function matchingRound(level, round) {
  const target = characters[round % 3];
  const choices = level === 1
    ? [target, characters[(round + 1) % 3]] : [...characters];
  // Alternate the correct position, including in the two-choice introductory level.
  const correctPosition = level === 1 ? round % 2 : (round + 1) % 3;
  choices.splice(choices.indexOf(target), 1);
  choices.splice(correctPosition, 0, target);
  return { target, choices };
}

export function memoryDeck(level, random = Math.random) {
  return shuffle(characters.slice(0, level === 1 ? 2 : 3)
    .flatMap(name => [{ id: name + '-a', name }, { id: name + '-b', name }]), random);
}

export function matchingCards(deck, first, second) {
  return first !== second && deck[first]?.name === deck[second]?.name;
}

// Vertical slices cover the original square exactly, without gaps or stretching.
export function sliceStyle(piece, count) {
  return { width: `${count * 100}%`, left: `${-piece * 100}%` };
}

export function closeToSlot(point, rect) {
  const margin = Math.min(32, rect.width * .25);
  return point.x >= rect.left - margin && point.x <= rect.right + margin
    && point.y >= rect.top - margin && point.y <= rect.bottom + margin;
}

export function sortingApples(random = Math.random) {
  return shuffle(['red', 'red', 'red', 'red', 'yellow', 'yellow', 'yellow']
    .map((color, index) => ({ id: 'apple-' + index, color })), random);
}

export function canSort(apple, basket, placed) {
  return Boolean(apple && apple.color === basket && !placed.includes(apple.id));
}

export function largerBasket(apples) {
  return apples.filter(apple => apple.color === 'red').length > apples.filter(apple => apple.color === 'yellow').length ? 'red' : 'yellow';
}
