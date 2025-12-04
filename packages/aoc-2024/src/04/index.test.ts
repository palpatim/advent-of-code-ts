import {
  allNamedOffsets,
  getPointAtOffset,
  BrokenGridIterator,
  BrokenGridIteratorResult,
  BrokenGridOffsetIterator,
  readToString,
  reverseString,
} from "@palpatim/aoc-utils";
import * as path from "node:path";

const solve1 = (input: string, target: string): number => {
  let result = 0;
  const grid = input.split("\n").map((line) => line.split(""));
  const gridIter = new BrokenGridIterator(grid);

  let iterResult: BrokenGridIteratorResult<string | undefined> = {
    done: false,
    value: gridIter.peek(),
    point: gridIter.currentPoint(),
  };

  while (!iterResult.done) {
    const startingCell = iterResult.value;
    const currentPoint = iterResult.point;
    iterResult = gridIter.next();
    if (startingCell !== target[0]) {
      continue;
    }

    for (const offset of allNamedOffsets()) {
      const offsetIter = new BrokenGridOffsetIterator(
        grid,
        currentPoint,
        offset
      );

      const segment = offsetIter.map((v) => v);
      const segmentString = segment.join("");
      if (segmentString.startsWith(target)) {
        result += 1;
      }
    }
  }

  return result;
};

const solve2 = (input: string, target: string): number => {
  let result = 0;
  const targetStartingChar = target[Math.floor(target.length / 2)];
  const grid = input.split("\n").map((line) => line.split(""));
  const gridIter = new BrokenGridIterator(grid);

  let iterResult: BrokenGridIteratorResult<string | undefined> = {
    done: false,
    value: gridIter.peek(),
    point: gridIter.currentPoint(),
  };

  while (!iterResult.done) {
    const startingCell = iterResult.value;
    const currentPoint = iterResult.point;

    iterResult = gridIter.next();
    if (startingCell !== targetStartingChar) {
      continue;
    }

    const lrSegmentStart = getPointAtOffset(currentPoint, "NW");
    const lrSegmentIter = new BrokenGridOffsetIterator(
      grid,
      lrSegmentStart,
      "SE"
    );
    const lrSegment = lrSegmentIter
      .map((v) => v)
      .slice(0, 3)
      .join("");
    const lrSegmentIsValid =
      lrSegment === target || reverseString(lrSegment) === target;

    const rlSegmentStart = getPointAtOffset(currentPoint, "NE");
    const rlSegmentIter = new BrokenGridOffsetIterator(
      grid,
      rlSegmentStart,
      "SW"
    );
    const rlSegment = rlSegmentIter
      .map((v) => v)
      .slice(0, 3)
      .join("");
    const rlSegmentIsValid =
      rlSegment === target || reverseString(rlSegment) === target;

    if (lrSegmentIsValid && rlSegmentIsValid) {
      result += 1;
    }
  }

  return result;
};

describe("aoc", () => {
  test("demo 1", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve1(input, "XMAS")).toEqual(18);
  });

  test("part 1", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve1(input, "XMAS")).toEqual(2551);
  });

  test("demo 2", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve2(input, "MAS")).toEqual(9);
  });

  test("part 2", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve2(input, "MAS")).toEqual(1985);
  });
});
