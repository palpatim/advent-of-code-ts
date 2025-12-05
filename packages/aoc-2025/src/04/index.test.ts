import {
  getAdjacentCells,
  Grid,
  Point,
  GridIterator,
  readToString,
  setCellAtPoint,
} from "@palpatim/aoc-utils";
import * as path from "node:path";

type GridElement = "." | "@";

const parseGrid = (input: string): GridElement[][] => {
  const grid = input.split("\n").map((line) => line.split(""));
  return grid as Grid<GridElement>;
};

const solve = (input: string, iterate: boolean): number => {
  const grid = parseGrid(input);

  let lastResult = 0;
  let result = 0;
  do {
    const iter = new GridIterator(grid);
    lastResult = result;
    const pointsToClear: Point[] = [];
    for (const el of iter) {
      const { value, point } = el;
      if (value === ".") {
        continue;
      }
      const neighbors = getAdjacentCells(point, grid);
      const blockedNeighbors = neighbors.filter((n) => n == "@");
      if (blockedNeighbors.length < 4) {
        pointsToClear.push(point);
        result += 1;
      }
    }
    pointsToClear.forEach((p) => setCellAtPoint(".", p, grid));
  } while (iterate && result !== lastResult);

  return result;
};

describe("aoc", () => {
  test("demo 1", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve(input, false)).toEqual(13);
  });

  test("part 1", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve(input, false)).toEqual(1523);
  });

  test("demo 2", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve(input, true)).toEqual(43);
  });

  test("part 2", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve(input, true)).toEqual(9290);
  });
});
