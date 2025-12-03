import {
  addArray,
  ClosedRange,
  parseBase10Int,
  readToString,
} from "@palpatim/aoc-utils";
import * as path from "node:path";

const parseLine = (input: string): ClosedRange[] => {
  const pairs = input.split(",");
  const ranges = pairs.map((pair) => {
    const [start, end] = pair.split("-").map(parseBase10Int);
    return new ClosedRange(start, end);
  });
  return ranges;
};

const isInvalidIdForSegmentCount = (
  id: number,
  segmentCount: number
): boolean => {
  const strId = `${id}`;
  if (strId.length % segmentCount != 0) {
    return false;
  }

  const segment = strId.slice(0, strId.length / segmentCount);
  const components = Array(segmentCount).fill(segment);
  const repeatedId = components.join("");
  return repeatedId === strId;
};

/**
 * Invalid IDs are strings that consist entirely of repeating tokens. A token is
 * a series of characters of length 1 - len(id)/2.
 *
 */
const isValidId = (id: number, maxSegments: number | undefined): boolean => {
  // Negative IDs are always invalid
  if (id < 0) {
    return false;
  }

  // Single-digit IDs are always valid
  if (id < 10) {
    return true;
  }

  const strId = `${id}`;

  if (maxSegments === undefined) {
    maxSegments = strId.length;
  }

  for (const segmentCount of new ClosedRange(2, maxSegments)) {
    if (isInvalidIdForSegmentCount(id, segmentCount)) {
      return false;
    }
  }

  return true;
};

const invalidIdsInRange = (
  range: ClosedRange,
  maxSegments: number | undefined
): number[] => {
  const invalidIds: number[] = [];
  for (const id of range) {
    if (!isValidId(id, maxSegments)) {
      invalidIds.push(id);
    }
  }
  return invalidIds;
};

const solve = (
  input: string,
  maxSegments: number | undefined = undefined
): number => {
  const ranges = parseLine(input.split("\n")[0]);

  const invalidIds: number[] = [];
  for (const range of ranges) {
    invalidIds.push(...invalidIdsInRange(range, maxSegments));
  }

  const sum = addArray(invalidIds);
  return sum;
};

describe("invalidIdsInRange", () => {
  test.each([
    [11, 22, [11, 22]],
    [95, 115, [99]],
    [998, 1012, [1010]],
    [1188511880, 1188511890, [1188511885]],
    [222220, 222224, [222222]],
    [1698522, 1698528, []],
    [446443, 446449, [446446]],
    [38593856, 38593862, [38593859]],
    [2121212118, 2121212124, []],
  ])(
    "invalidIdsInRange(%i, %i) (2 segments)",
    (start: number, end: number, expected: number[]) => {
      expect(invalidIdsInRange(new ClosedRange(start, end), 2)).toEqual(
        expected
      );
    }
  );
});

describe("aoc", () => {
  test("demo 1", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve(input, 2)).toEqual(1227775554);
  });

  test("part 1", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve(input, 2)).toEqual(54234399924);
  });

  test("demo 2", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve(input)).toEqual(4174379265);
  });

  test("part 2", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve(input)).toEqual(70187097315);
  });
});
