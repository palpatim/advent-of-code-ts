import {
  getCellAtPoint,
  getPointAtOffset,
  Grid,
  GridIterator,
  NamedOffset,
  Point,
  readToString,
} from "@palpatim/aoc-utils";
import * as path from "node:path";

type WarehouseItem = "." | "@" | "O" | "#" | "[" | "]";

const isBot = (value: WarehouseItem): value is "@" => value === "@";

const isSmallBox = (value: WarehouseItem): value is "O" => value === "O";
const isLeftBox = (value: WarehouseItem): value is "[" => value === "[";
const isRightBox = (value: WarehouseItem): value is "]" => value === "]";

const isEmpty = (value: WarehouseItem): value is "." => value === ".";
const isWall = (value: WarehouseItem): value is "#" => value === "#";

type MoveDirection = ">" | "<" | "^" | "v";
const moveDirectionToOffset: Record<MoveDirection, NamedOffset> = {
  ">": "E",
  "<": "W",
  "^": "N",
  v: "S",
} as const;

const dumpGrid = (grid: Grid<WarehouseItem>): string => {
  const rows = grid.map((row) => row.join(""));
  return rows.join("\n");
};

const cloneGrid = (grid: Grid<WarehouseItem>): Grid<WarehouseItem> => {
  return grid.map((row) => [...row]);
};

const moveItem = (
  item: WarehouseItem,
  srcPosition: Point,
  destPosition: Point,
  grid: Grid<WarehouseItem>
) => {
  grid[destPosition.row][destPosition.col] = item;
  grid[srcPosition.row][srcPosition.col] = ".";
};

/**
 * Attempts to move the stack of items at `position` in the specified direction.
 * Returns true if the move was successful; false otherwise.
 *
 * For wide boxes, we'll move one side first (which side depends on which side
 * of the box we encounter, and the direction of the move). Breaking down a
 * stack of wide boxes, that would look like:
 *
 *    MOVE: >
 *    .....@[][].##
 *    .....@[][.]##
 *    .....@[].[]##
 *    .....@[.][]##
 *    .....@.[][]##
 *    ......@[][]##
 *
 *    MOVE: > ......@[][]## <--- FAIL - rightmost right side is blocked
 *
 * Now consider a vertical move blocked at a corner:
 *
 *    MOVE: ^
 *    ##############
 *    .....##.....##
 *    ......[][]..##
 *    .......[]...##
 *    .......@....##
 *
 *    ##############
 *    .....##..]..##
 *    ......[][...##
 *    .......[]...##
 *    .......@....##
 *
 *    ##############
 *    .....##.[]..##
 *    ......[]....##
 *    .......[]...##
 *    .......@....##
 *
 *    ##############
 *    .....##][]..##
 *    ......[.....##
 *    .......[]...##
 *    .......@....##
 *
 *    ##############
 *    .....##][]..##
 *    ......[.....## <--- FAIL
 *    .......[]...##
 *    .......@....##
 *
 * Because vertical moves can fail independently, we need a way to recover if
 * any individual piece fails to move. Options:
 * - Lookahead - instead of actually applying the moves recursively, compose the
 *   set of moves. If all of the moves are successful, apply them. Otherwise, if
 *   any move fails, the set is invalid and the entire move doesn't apply.
 * - Test, then apply - Apply the moves to a clone of the grid. If all succeed,
 *   reapply the moves to the real grid. If any fail, discard the clone and
 *   continue.
 * - Rollback - Similar to above, but if any fail, restore the state from the
 *   clone.
 *
 * Of these, test, then apply seems easiest to code. We're able to optimize by
 * only performing this test/apply cycle on vertical moves where we encounter a
 * wide box.
 */
const moveItemAtPosition = (
  srcPosition: Point,
  moveDirection: MoveDirection,
  grid: Grid<WarehouseItem>
): boolean => {
  const item = getCellAtPoint(srcPosition, grid);
  if (!item) {
    throw new Error(`Invalid position ${srcPosition}`);
  }

  if (isWall(item)) {
    return false;
  }

  const moveOffset = moveDirectionToOffset[moveDirection];
  const destinationPosition = getPointAtOffset(srcPosition, moveOffset);
  const destinationItem = getCellAtPoint(destinationPosition, grid);
  if (!destinationItem) {
    throw new Error(`Invalid destination position ${destinationPosition}`);
  } else if (isWall(destinationItem)) {
    return false;
  } else if (isBot(destinationItem)) {
    // Should never happen
    throw new Error(`Bot at destination position: ${destinationPosition}`);
  } else if (isEmpty(destinationItem)) {
    moveItem(item, srcPosition, destinationPosition, grid);
    return true;
  } else if (isLeftBox(destinationItem) || isRightBox(destinationItem)) {
    if (isLeftBox(destinationItem) && moveOffset === "W") {
      throw new Error(
        "Unexpected move condition: Attempting to move W but encountered a left box side"
      );
    }
    if (isRightBox(destinationItem) && moveOffset === "E") {
      throw new Error(
        "Unexpected move condition: Attempting to move E but encountered a right box side"
      );
    }

    const positionOfCorrespondingSide = isLeftBox(destinationItem)
      ? getPointAtOffset(destinationPosition, "E")
      : getPointAtOffset(destinationPosition, "W");
    // Apply a horizontal move, handling the farthest edge first
    if (moveOffset === "W" || moveOffset === "E") {
      if (
        moveItemAtPosition(positionOfCorrespondingSide, moveDirection, grid) &&
        moveItemAtPosition(destinationPosition, moveDirection, grid)
      ) {
        moveItem(item, srcPosition, destinationPosition, grid);
        return true;
      }
    } else {
      // Apply a vertical move against a clone of the grid. If all succeed,
      // apply in the real grid, otherwise continue.
      const testGrid = cloneGrid(grid);
      if (
        moveItemAtPosition(
          positionOfCorrespondingSide,
          moveDirection,
          testGrid
        ) &&
        moveItemAtPosition(destinationPosition, moveDirection, testGrid)
      ) {
        moveItemAtPosition(positionOfCorrespondingSide, moveDirection, grid);
        moveItemAtPosition(destinationPosition, moveDirection, grid);
        moveItem(item, srcPosition, destinationPosition, grid);
        return true;
      }
    }
  } else {
    // Item is a small box. Attempt to slide it. If successful, we can move our source item
    if (moveItemAtPosition(destinationPosition, moveDirection, grid)) {
      moveItem(item, srcPosition, destinationPosition, grid);
      return true;
    }
  }
  return false;
};

const widenGridItem = (item: string): WarehouseItem[] => {
  switch (item) {
    case ".":
      return [".", "."];
    case "@":
      return ["@", "."];
    case "O":
      return ["[", "]"];
    case "#":
      return ["#", "#"];
    default:
      throw new Error(`Invalid item: ${item}`);
  }
};

const solve = (input: string, widen: boolean = false): number => {
  const [gridStr, movesStr] = input.split("\n\n");
  const grid = gridStr.split("\n").map((row) => {
    if (widen) {
      return row.split("").flatMap(widenGridItem);
    } else {
      return row.split("") as WarehouseItem[];
    }
  }) as Grid<WarehouseItem>;

  const moves = movesStr.replace(/\n/g, "").split("") as [];

  let botPos = new GridIterator(grid).findIndex(isBot)?.point;
  if (!botPos) {
    throw new Error("No bot found");
  }

  for (const move of moves) {
    if (moveItemAtPosition(botPos, move, grid)) {
      const offset = moveDirectionToOffset[move];
      botPos = getPointAtOffset(botPos, offset);
    }

    // console.log(`MOVE: ${move}\n${dumpGrid(grid)}\n`);
  }

  let result = 0;
  const gridIter = new GridIterator(grid);
  let done = gridIter.done;
  while (!done) {
    const { value, point, done: _done } = gridIter.next();
    if (isSmallBox(value) || isLeftBox(value)) {
      result += 100 * point.row + point.col;
    }
    done = _done ?? true;
  }
  return result;
};

describe("aoc", () => {
  test("demo 1 small", () => {
    const input = readToString(path.join(__dirname, "input-demo-sm.txt"));
    expect(solve(input)).toEqual(2028);
  });

  test("demo 1 large", () => {
    const input = readToString(path.join(__dirname, "input-demo-lg.txt"));
    expect(solve(input)).toEqual(10092);
  });

  test("part 1", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve(input)).toEqual(1563092);
  });

  test("demo 2 large", () => {
    const input = readToString(path.join(__dirname, "input-demo-lg.txt"));
    expect(solve(input, true)).toEqual(9021);
  });

  test("part 2", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve(input, true)).toEqual(1582688);
  });
});
