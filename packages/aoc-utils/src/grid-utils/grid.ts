import { GridOffsetIterator } from "./grid-offset-iterator";
import { allNamedOffsets, getPointAtOffset, NamedOffset } from "./offset";
import { Point } from "./point";

/**
 * A zero-indexed rectangular grid
 */
export type Grid<T> = T[][];

export const getAdjacentCells = <T>(p: Point, grid: Grid<T>): T[] => {
  const result: T[] = [];
  allNamedOffsets().forEach((o) => {
    const val = getCellAtOffsetFromPoint(p, o, grid);
    if (typeof val !== "undefined") {
      result.push(val);
    }
  });
  return result;
};

export const getCellAtOffsetFromPoint = <T>(
  p: Point,
  offset: NamedOffset,
  grid: Grid<T>
): T | undefined => {
  const newP = getPointAtOffset(p, offset);
  return getCellAtPoint(newP, grid);
};

export const getCellAtPoint = <T>(p: Point, grid: Grid<T>): T | undefined => {
  if (isValidPoint(p, grid)) {
    return grid[p.row][p.col];
  }
};

export const isValidPoint = <T>(p: Point, grid: Grid<T>): boolean => {
  return (
    p.row >= 0 && p.row < grid.length && p.col >= 0 && p.col < grid[0].length
  );
};

/**
 * Returns a copy of the grid, rotated to the left.
 *
 * Example:
 *     123
 *     456
 *     789
 *
 * Becomes
 *     369
 *     258
 *     147
 */
export const rotateLeft = <T>(grid: Grid<T>): Grid<T> => {
  if (grid.length === 0) {
    return [];
  }

  const rows = grid.length;
  const cols = grid[0].length;
  const result: Grid<T> = [];

  // For each column (starting from the rightmost)
  for (let col = cols - 1; col >= 0; col--) {
    const newRow: T[] = [];
    // For each row
    for (let row = 0; row < rows; row++) {
      newRow.push(grid[row][col]);
    }
    result.push(newRow);
  }

  return result;
};

/**
 * Sets the cell at the given point in the grid. If the point is not valid, this
 * function does nothing.
 */
export const setCellAtPoint = <T>(
  newValue: T,
  p: Point,
  grid: Grid<T>
): void => {
  if (isValidPoint(p, grid)) {
    grid[p.row][p.col] = newValue;
  }
};
