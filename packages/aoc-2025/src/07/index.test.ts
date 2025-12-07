import {
  getCellAtPoint,
  getPointAtOffset,
  Grid,
  GridIterator,
  isValidPoint,
  Point,
  pointToKey,
  readToString,
} from "@palpatim/aoc-utils";
import * as path from "node:path";

type GridElement = "." | "S" | "|" | "^";

const countSplits = (input: string): number => {
  const grid: Grid<GridElement> = input
    .split("\n")
    .map((line) => line.split("") as GridElement[]);

  const iter = new GridIterator(grid);

  // Find start point
  const start = iter.findResult((v) => v.value === "S");
  if (!start) return -1;

  const queue: Point[] = [start.point];
  const visited: Set<string> = new Set();
  let splitCount = 0;

  while (queue.length > 0) {
    const curr = queue.shift()!;

    const key = pointToKey(curr);
    if (visited.has(key)) {
      continue;
    }
    visited.add(key);

    const value = getCellAtPoint(curr, grid);

    if (value === "^") {
      splitCount += 1;
      const left = getPointAtOffset(curr, "W");
      if (isValidPoint(left, grid) && !visited.has(pointToKey(left))) {
        queue.push(left);
      }
      const right = getPointAtOffset(curr, "E");
      if (isValidPoint(right, grid) && !visited.has(pointToKey(right))) {
        queue.push(right);
      }
    } else {
      const next = getPointAtOffset(curr, "S");
      if (isValidPoint(next, grid) && !visited.has(pointToKey(next))) {
        queue.push(next);
      }
    }
  }

  return splitCount;
};

const countPaths = (input: string): number => {
  const grid: Grid<GridElement> = input
    .split("\n")
    .map((line) => line.split("") as GridElement[]);

  const iter = new GridIterator(grid);

  // Find start point
  const start = iter.findResult((v) => v.value === "S");
  if (!start) {
    return -1;
  }

  const countsByPoint: Record<string, number> = {};

  const countPathsImpl = (point: Point, grid: Grid<GridElement>): number => {
    if (countsByPoint[pointToKey(point)]) {
      return countsByPoint[pointToKey(point)];
    }

    // We've reached the bottom of the grid, return 1 for the path count
    if (!isValidPoint(point, grid)) {
      return 1;
    }

    const value = getCellAtPoint(point, grid);
    let count: number;
    if (value === "^") {
      const left = getPointAtOffset(point, "W");
      const right = getPointAtOffset(point, "E");
      count = countPathsImpl(left, grid) + countPathsImpl(right, grid);
    } else {
      const next = getPointAtOffset(point, "S");
      count = countPathsImpl(next, grid);
    }
    countsByPoint[pointToKey(point)] = count;
    return count;
  };

  return countPathsImpl(start.point, grid);
};

describe("aoc", () => {
  test("demo 1", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(countSplits(input)).toEqual(21);
  });

  test("part 1", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(countSplits(input)).toEqual(1546);
  });

  test("demo 2", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(countPaths(input)).toEqual(40);
  });

  test("part 2", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(countPaths(input)).toEqual(13883459503480);
  });
});
