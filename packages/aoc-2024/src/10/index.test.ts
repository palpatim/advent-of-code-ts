import {
  addTwoValues,
  getCellAtPoint,
  getPointAtOffset,
  Grid,
  BrokenGridIterator,
  isValidPoint,
  Point,
  pointToKey,
  readToString,
} from "@palpatim/aoc-utils";
import * as path from "node:path";

/**
 * Returns a set of the target cells reachable from `start`
 */
const hike = (start: Point, grid: Grid<number>): Record<string, number> => {
  const target = 9;
  const result: Record<string, number> = {};
  const current = getCellAtPoint(start, grid)!;
  if (current === target) {
    result[pointToKey(start)] = 1;
    return result;
  }

  const candidates: Point[] = (["N", "E", "S", "W"] as const)
    .map((offset) => getPointAtOffset(start, offset))
    .filter((p) => getCellAtPoint(p, grid) === current + 1);

  for (const candidate of candidates) {
    const hikeResult = hike(candidate, grid);
    for (const [key, value] of Object.entries(hikeResult)) {
      result[key] = result[key] ?? 0;
      result[key] += value;
    }
  }

  return result;
};

const solve = (input: string, countValues: boolean): number => {
  const grid = input.split("\n").map((line) => line.split("").map(Number));
  const gridIter = new BrokenGridIterator(grid);

  let done = false;

  const scores: Record<string, number> = {};

  while (!done) {
    const { point: start, done: iterDone } = gridIter.findIndex(
      (cell) => cell === 0
    );
    done = iterDone!;
    if (!isValidPoint(start, grid)) {
      break;
    }

    const targetsReached = hike(start, grid);
    if (countValues) {
      scores[pointToKey(start)] = Object.values(targetsReached).reduce(
        addTwoValues,
        0
      );
    } else {
      scores[pointToKey(start)] = Object.keys(targetsReached).length;
    }
  }

  const result = Object.values(scores).reduce(addTwoValues, 0);
  return result;
};

describe("aoc", () => {
  test("demo 1", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve(input, false)).toEqual(36);
  });

  test("part 1", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve(input, false)).toEqual(574);
  });

  test("demo 2", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve(input, true)).toEqual(81);
  });

  test("part 2", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve(input, true)).toEqual(1238);
  });
});
