import { allOffsets, getPointAtOffset, Offset } from "./offset";
import { Point } from "./point";

/**
 * A zero-indexed rectangular grid
 */
export type Grid<T> = T[][];

export const getAdjacentCells = <T>(p: Point, grid: Grid<T>): T[] => {
  const result: T[] = [];
  allOffsets().forEach((o) => {
    const val = getCellAtOffsetFromPoint(p, o, grid);
    if (typeof val !== "undefined") {
      result.push(val);
    }
  });
  return result;
};

export const getCellAtOffsetFromPoint = <T>(
  p: Point,
  offset: Offset,
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
