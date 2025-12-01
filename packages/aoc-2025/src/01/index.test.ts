import {
  abs,
  int,
  parseBase10Int,
  readToString,
  stripNonNumeric,
  trimString,
} from "@palpatim/aoc-utils";
import * as path from "node:path";

const parseLine = (input: string): number => {
  const sign = input.startsWith("L") ? -1 : 1;
  const num = parseBase10Int(stripNonNumeric(input)) * sign;
  if (isNaN(num)) {
    throw new Error(`Unexpected input: ${input}`);
  }
  return num;
};

const passesOrEndsOnZero = (start: number, input: string): number => {
  const lines = input.split("\n").map(trimString);
  let curr = start;
  let result = 0;

  lines.forEach((l) => {
    const offset = parseLine(l);

    if (offset === 0) {
      return;
    }

    // Increment for every full revolution of the dial
    const fullCycles = abs(int(offset / 100));
    result += fullCycles;

    // Now deal with the remainder:
    const remainingOffset = offset % 100;
    if (remainingOffset === 0) {
      return;
    }

    const interim = curr + remainingOffset;

    // Increment if sign changed (we passed through zero)
    if ((curr < 0 && interim > 0) || (curr > 0 && interim < 0)) {
      result += 1;
    }

    curr = interim % 100;

    // Now increment if...
    if (curr == 0) {
      // ...we landed on zero, or
      result += 1;
    } else {
      // ...we passed through zero due
      result += abs(int(interim / 100));
    }
  });

  return result;
};

const endsOnZero = (input: string): number => {
  const lines = input.split("\n").map(trimString);
  let curr = 50;

  let endingZeros = 0;

  lines.forEach((l) => {
    const offset = parseLine(l);

    const interim = curr + offset + 100;
    curr = interim % 100;
    if (curr == 0) {
      endingZeros += 1;
    }
  });
  return endingZeros;
};

describe("aoc", () => {
  test("demo 1", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(endsOnZero(input)).toEqual(3);
  });

  test("part 1", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(endsOnZero(input)).toEqual(1150);
  });

  test("demo 2", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(passesOrEndsOnZero(50, input)).toEqual(6);
  });

  test("part 2", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(passesOrEndsOnZero(50, input)).toEqual(6738);
  });

  test.each([
    [0, "R1", 0],
    [0, "L1", 0],
    [0, "R99", 0],
    [0, "L99", 0],
    [0, "R100", 1],
    [0, "L100", 1],
    [0, "R150", 1],
    [0, "L150", 1],

    [1, "R1", 0],
    [1, "L1", 1],
    [1, "R99", 1],
    [1, "L99", 1],
    [1, "R100", 1],
    [1, "L100", 1],
    [1, "R150", 1],
    [1, "L150", 2],

    [-1, "R1", 1],
    [-1, "L1", 0],
    [-1, "R99", 1],
    [-1, "L99", 1],
    [-1, "R100", 1],
    [-1, "L100", 1],
    [-1, "R150", 2],
    [-1, "L150", 1],

    [50, "R10", 0],
    [50, "R60", 1],
    [50, "R100", 1],
    [50, "R1000", 10],
    [50, "L10", 0],
    [50, "L60", 1],
    [50, "L100", 1],
    [48, "R52", 1],
  ])(
    "passesOrEndsOnZero(%i, %s) == %i",
    (start: number, input: string, expected: number) => {
      expect(passesOrEndsOnZero(start, input)).toEqual(expected);
    }
  );
});
