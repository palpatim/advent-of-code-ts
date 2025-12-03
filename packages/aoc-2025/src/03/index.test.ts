import { ClosedRange, readToString } from "@palpatim/aoc-utils";
import * as path from "node:path";

const parseLine = (input: string): number[] => {
  const digits = input.split("").map(Number);
  return digits;
};

const largestJoltage = (ar: number[], size: number): number => {
  if (ar.length <= size) {
    return Number(ar.join(""));
  }

  const indexOfMax = (ar: number[], indices: ClosedRange): number => {
    let max = ar[indices.lower];
    let maxIdx = indices.lower;
    for (const i of indices) {
      const curr = ar[i];
      if (curr === 9) {
        return i;
      }
      if (curr > max) {
        max = ar[i];
        maxIdx = i;
      }
    }
    return maxIdx;
  };

  const activatedIndexes = Array.of(size).fill(-1);
  let lastIndex = -1;
  for (let idx = 0; idx < size; idx++) {
    const maxIndex = indexOfMax(
      ar,
      new ClosedRange(lastIndex + 1, ar.length - size + idx)
    );
    activatedIndexes[idx] = maxIndex;
    lastIndex = maxIndex;
  }

  for (let idx = 0; idx < size; idx++) {
    activatedIndexes[idx] = ar[activatedIndexes[idx]];
  }

  return Number(activatedIndexes.join(""));
};

const solve = (input: string, size: number): number => {
  const lines: number[][] = input.split("\n").map(parseLine);
  const result = lines.reduce(
    (acc, line) => acc + largestJoltage(line, size),
    0
  );
  return result;
};

describe("largestJoltage", () => {
  test.each([
    ["", 0],
    ["1", 1],
    ["12", 12],
    ["123", 23],
    ["12321", 32],
    ["12326", 36],
    ["123267", 67],
    ["987654321111111", 98],
    ["811111111111119", 89],
    ["234234234234278", 78],
    ["818181911112111", 92],
    ["9891", 99],
    ["9891", 99],
  ])("largestJoltage(%s, 2) == %i", (input: string, expected: number) => {
    expect(largestJoltage(parseLine(input), 2)).toEqual(expected);
  });

  test.each([
    ["", 0],
    ["1", 1],
    ["12", 12],
    ["123", 123],
    ["987654321111111", 987654321111],
    ["811111111111119", 811111111119],
    ["234234234234278", 434234234278],
    ["818181911112111", 888911112111],
  ])("largestJoltage(%s, 12) == %i", (input: string, expected: number) => {
    expect(largestJoltage(parseLine(input), 12)).toEqual(expected);
  });
});

describe("aoc", () => {
  test("demo 1", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve(input, 2)).toEqual(357);
  });

  test("part 1", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve(input, 2)).toEqual(17207);
  });

  test("demo 2", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve(input, 12)).toEqual(3121910778619);
  });

  test("part 2", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve(input, 12)).toEqual(170997883706617);
  });
});
