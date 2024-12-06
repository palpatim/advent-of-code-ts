import {
  getCellAtPoint,
  getPointAtOffset,
  Grid,
  GridIterator,
  isValidPoint,
  Offset,
  Point,
  readToString,
} from "@palpatim/aoc-utils";
import * as path from "node:path";

type GuardDirection = "^" | ">" | "v" | "<";

const facingDirectionsToOffsets: Record<GuardDirection, Offset> = {
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

  private setState = () => {
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
  gridIter.find((v) => guardSymbols.includes(v));
  if (!gridIter.currentPoint()) {
    throw new Error("No guard found");
  }

  const guard = new Guard(
    grid,
    gridIter.currentPoint(),
    gridIter.peek() as GuardDirection
  );

  // Mark the guard's starting position as empty so it evaluates properly during
  // the advance() loop
  grid[gridIter.currentPoint().row][gridIter.currentPoint().col] = ".";

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
  return -1;
};

describe("aoc", () => {
  test("demo 1", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve1(input)).toEqual(41);
  });

  test.only("part 1", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve1(input)).toEqual(4722);
  });

  test("demo 2", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve2(input)).toEqual(-1);
  });

  test("part 2", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve2(input)).toEqual(-1);
  });
});
