import {
  getCellAtPoint,
  getPointAtOffset,
  Grid,
  GridIterator,
  isValidPoint,
  NamedOffset,
  Point,
  pointEq,
  readToString,
} from "@palpatim/aoc-utils";
import * as path from "node:path";

type GuardDirection = "^" | ">" | "v" | "<";

const facingDirectionsToOffsets: Record<GuardDirection, NamedOffset> = {
  ">": "E",
  "<": "W",
  "^": "N",
  v: "S",
};

type GuardState = "Walking" | "Blocked" | "OffGrid";

class Guard {
  constructor(
    public grid: Grid<string>,
    public position: Point,
    public direction: GuardDirection,
    public state: GuardState = "OffGrid"
  ) {
    this.setState();
  }

  public setState = () => {
    if (!isValidPoint(this.position, this.grid)) {
      this.state = "OffGrid";
      return;
    }

    const nextPoint = this.getNextPoint();
    const nextCell = getCellAtPoint(nextPoint, this.grid);

    switch (nextCell) {
      case "#":
        this.state = "Blocked";
        break;
      case ".":
        this.state = "Walking";
        break;
      case undefined:
        // The next step will take the guard off the grid, but until then,
        // they're still walking
        this.state = "Walking";
        break;
      default:
        throw new Error("Unknown state");
    }
  };

  private getNextPoint = (): Point => {
    const offset = facingDirectionsToOffsets[this.direction];
    return getPointAtOffset(this.position, offset);
  };

  public rotateRight = () => {
    const directionSequence: GuardDirection[] = ["^", ">", "v", "<"];
    const idx = directionSequence.findIndex((v) => v === this.direction);
    const newIdx = (idx + 1) % directionSequence.length;
    this.direction = directionSequence[newIdx];
    this.setState();
  };

  /**
   * Advances guard one cell in the direction they're facing, if possible.
   * Returns `true` if advance was successful; `false` if it was blocked.
   * `advance()` can take the guard off the grid. In that case, `advance()` will
   * return true, but the Guard's `state` will be `OffGrid`.
   */
  public advance = (): boolean => {
    if (this.state === "Blocked") {
      return false;
    }
    this.position = this.getNextPoint();
    this.setState();
    return true;
  };
}

const solve1 = (input: string): number => {
  const grid = input.split("\n").map((line) => line.split(""));
  const gridIter = new GridIterator(grid);
  const guardSymbols = Object.keys(facingDirectionsToOffsets);
  const iterResult = gridIter.findIndex((v) => guardSymbols.includes(v));
  if (!iterResult.value) {
    throw new Error("No guard found");
  }

  const guard = new Guard(
    grid,
    iterResult.point,
    iterResult.value as GuardDirection
  );

  // Mark the guard's starting position as empty so it evaluates properly during
  // the advance() loop
  grid[iterResult.point.row][iterResult.point.col] = ".";

  const visited = new Set<string>();
  while (guard.state !== "OffGrid") {
    visited.add(`${guard.position.row},${guard.position.col}`);
    if (guard.state === "Blocked") {
      guard.rotateRight();
    }
    guard.advance();
  }

  return visited.size;
};

const solve2 = (input: string): number => {
  const grid = input.split("\n").map((line) => line.split(""));
  const gridIter = new GridIterator(grid);
  const guardSymbols = Object.keys(facingDirectionsToOffsets);
  const iterResult = gridIter.findIndex((v) => guardSymbols.includes(v));
  if (!iterResult.value) {
    throw new Error("No guard found");
  }

  const guardStartingPosition = iterResult.point;
  const guardStartingDirection = iterResult.value as GuardDirection;
  const guard = new Guard(grid, guardStartingPosition, guardStartingDirection);

  // Mark the guard's starting position as empty so it evaluates properly during
  // the advance() loop
  grid[guardStartingPosition.row][guardStartingPosition.col] = ".";

  let loopsDetected = 0;

  const obstacleIter = new GridIterator(grid);

  // Remember the point at which we place an obstacle so we can reset it after
  // we're done testing the position
  let obstaclePoint: Point = obstacleIter.currentPoint();

  const reset = () => {
    grid[obstaclePoint.row][obstaclePoint.col] = ".";
    guard.direction = guardStartingDirection;
    guard.position = guardStartingPosition;
    guard.setState();
  };

  while (true) {
    // Place obstacle at the next clear spot
    const obstacleIterResult = obstacleIter.findIndex((v) => v === ".");
    if (obstacleIterResult.value === undefined) {
      // No more clear spots, we're done with all tests
      break;
    }

    // Remember the obstacle position so we can reset it after we're done with this test
    obstaclePoint = obstacleIterResult.point;

    // Can't place an obstacle at the guard's starting position
    if (pointEq(obstaclePoint, guardStartingPosition)) {
      continue;
    }

    // Place an obstacle
    grid[obstaclePoint.row][obstaclePoint.col] = "#";

    // Test for loop
    const visited = new Set<string>();
    while (guard.state !== "OffGrid") {
      // If the guard has visited this space before walking in the same direction,
      // they're in a loop
      const visitedKey = `${guard.position.row},${guard.position.col},${guard.direction}`;
      if (visited.has(visitedKey)) {
        loopsDetected += 1;
        break;
      }
      visited.add(visitedKey);
      if (guard.state === "Blocked") {
        guard.rotateRight();
      }
      guard.advance();
    }

    // Either the guard has exited the grid, or we found a loop. Either way,
    // reset the grid & the guard to the starting position and try the loop
    // again
    reset();
  }

  return loopsDetected;
};

describe("aoc", () => {
  test("demo 1", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve1(input)).toEqual(41);
  });

  test("part 1", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve1(input)).toEqual(4722);
  });

  test("demo 2", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve2(input)).toEqual(6);
  });

  // 20s execution time. We'll skip it by default...
  test.skip("part 2", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve2(input)).toEqual(1602);
  });
});
