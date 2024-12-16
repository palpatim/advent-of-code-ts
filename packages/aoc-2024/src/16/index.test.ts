import {
  Dijkstra,
  getCellAtPoint,
  getPointAtOffset,
  Grid,
  GridIterator,
  keyToPoint,
  NamedOffset,
  Point,
  pointToKey,
  readToString,
} from "@palpatim/aoc-utils";
import * as path from "node:path";

type GridItem = "S" | "E" | "#" | ".";

const isEmpty = (value: GridItem): value is "." => value === ".";
const isExit = (value: GridItem): value is "E" => value === "E";
const isStart = (value: GridItem): value is "S" => value === "S";
const isWall = (value: GridItem): value is "#" => value === "#";

/**
 * An array of allowable move directions. The array is ordered so that each
 * element is a 90 degree rotation from the preceeding one.
 */
const offsets: NamedOffset[] = ["N", "E", "S", "W"] as const;

const rotateLeft = (o: NamedOffset): NamedOffset => {
  const idx = offsets.indexOf(o);
  const newIdx = idx === 0 ? offsets.length - 1 : idx - 1;
  return offsets[newIdx];
};

const rotateRight = (o: NamedOffset): NamedOffset => {
  const idx = offsets.indexOf(o);
  return offsets[(idx + 1) % offsets.length];
};

const dumpGrid = (grid: Grid<GridItem>): string => {
  const rows = grid.map((row) => row.join(""));
  return rows.join("\n");
};

const toKey = (p: Point, o: NamedOffset): string => `${pointToKey(p)}|${o}`;

const fromKey = (k: string): [Point, NamedOffset] => {
  const [p, o] = k.split("|");
  return [keyToPoint(p), o as NamedOffset];
};

const solve = (input: string): number => {
  const grid = input.split("\n").map((row) => row.split("") as GridItem[]);

  // Build adjacency lists. Key is a point and a direction, as in:
  // - 0,0|E
  // - 0,0|N
  const dijkstra = new Dijkstra();
  const startPoint = new GridIterator(grid).findIndex(isStart).point;
  const exitPoint = new GridIterator(grid).findIndex(isExit).point;
  const startKey = toKey(startPoint, "E");

  // DFS through the grid to build the weighted graph
  const stack: string[] = [startKey];
  const visited = new Set<string>();
  while (stack.length > 0) {
    const currentKey = stack.pop()!;
    if (visited.has(currentKey)) {
      continue;
    }
    visited.add(currentKey);
    const [currentPoint, currentFacingDirection] = fromKey(currentKey);

    // Only consider adjacent cells in the same direction we're facing. Add that
    // cell plus a vertex for a rotation left, plus a rotation right. (We don't
    // need to consider 180 degrees since we just came from there)
    const leftKey = toKey(currentPoint, rotateLeft(currentFacingDirection));
    if (!visited.has(leftKey)) {
      stack.push(leftKey);
      dijkstra.addEdge(currentKey, leftKey, 1000);
    }

    const rightKey = toKey(currentPoint, rotateRight(currentFacingDirection));
    if (!visited.has(rightKey)) {
      stack.push(rightKey);
      dijkstra.addEdge(currentKey, rightKey, 1000);
    }

    const forwardPoint = getPointAtOffset(currentPoint, currentFacingDirection);
    const forwardCell = getCellAtPoint(forwardPoint, grid);
    if (forwardCell && !isWall(forwardCell)) {
      const forwardKey = toKey(forwardPoint, currentFacingDirection);
      stack.push(forwardKey);
      dijkstra.addEdge(currentKey, forwardKey, 1);
    }
  }

  const exitKey = pointToKey(exitPoint);
  const shortestPath = dijkstra.shortestPath(startKey, (key) =>
    key.startsWith(exitKey)
  );
  return shortestPath;
};

describe("aoc", () => {
  test("demo 1", () => {
    const input = readToString(path.join(__dirname, "input-demo-1.txt"));
    expect(solve(input)).toEqual(7036);
  });

  test("demo 2", () => {
    const input = readToString(path.join(__dirname, "input-demo-2.txt"));
    expect(solve(input)).toEqual(11048);
  });

  test("part 1", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve(input)).toEqual(-1);
  });

  test.skip("demo 2", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve(input)).toEqual(-1);
  });

  test.skip("part 2", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve(input)).toEqual(-1);
  });
});
