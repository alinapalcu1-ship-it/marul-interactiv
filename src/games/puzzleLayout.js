// Actual viewport sizing for the two visible puzzle panels (CSS-independent).
// Use the game workspace dimensions, not the full phone viewport.
export function measurePuzzlePanels(width, height) {
  if (!(width > 0 && height > 0)) return null;
  const gap = Math.max(5, Math.min(10, Math.floor(height * .018)));
  const sideBySide = height < 310 && width >= 325;
  if (sideBySide) {
    const size = Math.floor(Math.min((width - gap - 8) / 2, height * .87));
    return { board: size, tray: size, gap, sideBySide };
  }
  const usable = Math.max(0, height - gap - 10);
  const board = Math.floor(Math.min(width * .93, usable * .55));
  const tray = Math.floor(Math.min(width * .90, usable * .43));
  return { board, tray, gap, sideBySide: false };
}
