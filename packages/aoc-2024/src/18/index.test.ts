import {
  dumpGrid,
  getCellAtPoint,
  getPointAtOffset,
  Grid,
  isValidPoint,
  keyToPoint,
  NamedOffset,
  Point,
  pointToKey,
  readToString,
  setCellAtPoint,
  TreeNode,
} from "@palpatim/aoc-utils";
import * as path from "node:path";

const getShortestPath = (
  start: Point,
  end: Point,
  grid: Grid<string>
): number => {
  let current = new TreeNode<Point>(start);
  const endKey = pointToKey(end);
  const queue = [current];
  const visited = new Set<string>();

  // BFS from start to end to find shortest path, considering only cardinal directions
  while (queue.length > 0) {
    current = queue.shift()!;
    const currentPoint = current.value;
    const currentKey = pointToKey(currentPoint);
    if (visited.has(currentKey)) {
      continue;
    }
    visited.add(currentKey);

    if (currentKey === endKey) {
      return current.getPathToRoot().length - 1;
    }

    for (const offset of ["N", "E", "S", "W"] as NamedOffset[]) {
      const candidateNeighbor = getPointAtOffset(currentPoint, offset);
      if (!isValidPoint(candidateNeighbor, grid)) {
        continue;
      }

      if (getCellAtPoint(candidateNeighbor, grid) === "#") {
        continue;
      }

      const neighborKey = pointToKey(candidateNeighbor);
      if (visited.has(neighborKey)) {
        continue;
      }

      queue.push(new TreeNode(candidateNeighbor, current));
    }
  }

  return NaN;
};

const solve = (input: string, gridSize: number, iterations: number): number => {
  const corrupted: Point[] = input
    .split("\n")
    .map((line) => line.split(",").map(Number))
    .map(([col, row]) => ({ row, col }));

  const grid = Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => ".")
  );

  for (let i = 0; i < iterations; i++) {
    setCellAtPoint("#", corrupted[i], grid);
  }

  return getShortestPath(
    { row: 0, col: 0 },
    { row: gridSize - 1, col: gridSize - 1 },
    grid
  );
};

const solve2 = (input: string, gridSize: number): string => {
  const corrupted: Point[] = input
    .split("\n")
    .map((line) => line.split(",").map(Number))
    .map(([col, row]) => ({ row, col }));

  const grid = Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => ".")
  );

  const start: Point = { row: 0, col: 0 };
  const exit: Point = { row: gridSize - 1, col: gridSize - 1 };

  for (const corruptedPoint of corrupted) {
    setCellAtPoint("#", corruptedPoint, grid);
    if (isNaN(getShortestPath(start, exit, grid))) {
      return `${corruptedPoint.col},${corruptedPoint.row}`;
    }
  }
};

describe("aoc", () => {
  test("demo 1", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve(input, 7, 12)).toEqual(22);
  });

  test("part 1", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve(input, 71, 1024)).toEqual(302);
  });

  test("demo 2", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve2(input, 7)).toEqual("6,1");
  });

  test("part 2", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve2(input, 71)).toEqual("24,32");
  });
});
