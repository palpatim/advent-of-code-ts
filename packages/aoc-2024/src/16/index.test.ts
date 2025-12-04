import {
  Dijkstra,
  getCellAtPoint,
  getPointAtOffset,
  Grid,
  BrokenGridIterator,
  keyToPoint,
  NamedOffset,
  Point,
  pointEq,
  pointToKey,
  readToString,
  union,
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

const solve = (input: string, returnCost: boolean = true): number => {
  const grid = input.split("\n").map((row) => row.split("") as GridItem[]);

  // Build adjacency lists. Key is a point and a direction, as in:
  // - 0,0|E
  // - 0,0|N
  const dijkstra = new Dijkstra();
  const startPoint = new BrokenGridIterator(grid).findIndex(isStart).point;
  const exitPoint = new BrokenGridIterator(grid).findIndex(isExit).point;
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
    // need to consider 180 degrees since we just came from there). As an
    // optimization, we'll only consider a direction if it leads to a valid
    // cell.
    for (const newDirection of [
      rotateLeft(currentFacingDirection),
      rotateRight(currentFacingDirection),
    ]) {
      const newDirectionKey = toKey(currentPoint, newDirection);
      stack.push(newDirectionKey);
      dijkstra.addEdge(currentKey, newDirectionKey, 1000);
    }

    const forwardPoint = getPointAtOffset(currentPoint, currentFacingDirection);
    const forwardCell = getCellAtPoint(forwardPoint, grid);
    if (forwardCell && !isWall(forwardCell)) {
      const forwardKey = toKey(forwardPoint, currentFacingDirection);
      stack.push(forwardKey);
      dijkstra.addEdge(currentKey, forwardKey, 1);
    }
  }

  const isExitKey = (key: string) => pointEq(fromKey(key)[0], exitPoint);
  const shortestPathResult = dijkstra.shortestPath(startKey, isExitKey);

  if (returnCost) {
    return shortestPathResult.cost;
  } else {
    // Keep track of all points in each shortest path, then count them up
    const allShortestPaths: Set<string>[] = [];

    // DFS from end to start
    const path: string[] = [];

    // Exit points may be accessible from multiple directions, so find all of them
    const stack: string[] = [];
    for (const key of shortestPathResult.prev.keys()) {
      if (isExitKey(key)) {
        stack.push(key);
      }
    }

    while (stack.length > 0) {
      const currentKey = stack.pop()!;
      path.push(currentKey);

      if (currentKey === startKey) {
        allShortestPaths.push(new Set(path));
      }

      const parents = shortestPathResult.prev.get(currentKey);

      if (!parents || parents.size === 0) {
        path.pop();
      } else {
        stack.push(...Array.from(parents));
      }
    }

    const allVertices = allShortestPaths.reduce(
      (acc, curr) => (acc = union(acc, curr)),
      new Set()
    );
    const allPointKeys = Array.from(allVertices).map((key) =>
      pointToKey(fromKey(key)[0])
    );
    const uniqueKeys = new Set(allPointKeys);
    console.log(`uniqueKeys: ${JSON.stringify(Array.from(uniqueKeys))}`);
    return uniqueKeys.size;
  }
};

describe("aoc", () => {
  test("part 1, demo 1", () => {
    const input = readToString(path.join(__dirname, "input-demo-1.txt"));
    expect(solve(input)).toEqual(7036);
  });

  test("part 1, demo 2", () => {
    const input = readToString(path.join(__dirname, "input-demo-2.txt"));
    expect(solve(input)).toEqual(11048);
  });

  test("part 1", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve(input)).toEqual(111480);
  });

  test("part 2, demo 1", () => {
    const input = readToString(path.join(__dirname, "input-demo-1.txt"));
    expect(solve(input, false)).toEqual(45);
  });

  test("part 2, demo 2", () => {
    const input = readToString(path.join(__dirname, "input-demo-2.txt"));
    expect(solve(input, false)).toEqual(64);
  });

  test.skip("part 2", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    // Solution returns 555, which is too high. Adding a "visited" check on path
    // in the main DFS loop reduces to 481, which is also incorrect.
    expect(solve(input, false)).toEqual(-1);
  });
});
