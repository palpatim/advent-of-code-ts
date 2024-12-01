import * as path from "node:path";

import {
  abs,
  addTwoValues,
  getAtIndex,
  numericCompare,
  parseBase10Int,
  readToString,
  subtractFixedArray,
  trimString,
  zip,
} from "@palpatim/aoc-utils";

const parseLine = (input: string): [number, number] => {
  const numbers = input.split(/\s+/).map(parseBase10Int);
  const hasTwo = (ar: number[]): ar is [number, number] =>
    Array.isArray(ar) && ar.length === 2;
  if (!hasTwo(numbers)) {
    throw new Error(`Unexpected input: ${input}`);
  }
  return numbers;
};

const getAt0 = getAtIndex<number>(0);
const getAt1 = getAtIndex<number>(1);

const solve1 = (input: string): number => {
  const lines = input.split("\n").map(trimString);
  const pairs = lines.map(parseLine);
  const left = pairs.map(getAt0).sort(numericCompare);
  const right = pairs.map(getAt1).sort(numericCompare);

  const zipped = zip(left, right);

  const totalDistance = zipped
    .map(subtractFixedArray)
    .map(abs)
    .reduce(addTwoValues);
  return totalDistance;
};

const solve2 = (input: string): number => {
  const lines = input.split("\n").map(trimString);
  const pairs = lines.map(parseLine);
  const left = pairs.map(getAt0).sort(numericCompare);
  const right = pairs.map(getAt1).sort(numericCompare);

  const rightHistogram = right.reduce((acc, curr) => {
    acc[curr] = acc[curr] ?? 0;
    acc[curr] += 1;
    return acc;
  }, {} as {[key: number]: number});

  const similarityScore = left
    .map(n => n * (rightHistogram[n] ?? 0))
    .reduce(addTwoValues);

  return similarityScore;
};

describe("aoc", () => {
  test("demo 1", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve1(input)).toEqual(11);
  });

  test("part 1", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve1(input)).toEqual(1873376);
  });

  test("demo 2", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve2(input)).toEqual(31);
  });

  test("part 2", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve2(input)).toEqual(18997088);
  });
});
