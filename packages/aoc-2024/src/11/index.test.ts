import * as path from "node:path";
import { readToString } from "@palpatim/aoc-utils";

// Part 1 originally brute-forced. Tried various approaches to Pt2 including
// parallelizing w/a Worker and memoizing, to no effect. Final approach 100%
// stolen from https://github.com/adamchalmers/aoc24/blob/main/rust/src/day11.rs

const incrementCount = (
  map: Map<number, number>,
  key: number,
  count: number
) => {
  if (map.has(key)) {
    map.set(key, map.get(key)! + count);
  } else {
    map.set(key, count);
  }
};

const processIteration = (
  valueCounts: Map<number, number>
): Map<number, number> => {
  const newValueCounts = new Map<number, number>();

  valueCounts.forEach((count, value) => {
    const vString = `${value}`;
    if (value === 0) {
      incrementCount(newValueCounts, 1, count);
    } else if (vString.length % 2 === 0) {
      const middle = vString.length / 2;
      const left = vString.slice(0, middle);
      const right = vString.slice(middle);
      incrementCount(newValueCounts, Number(left), count);
      incrementCount(newValueCounts, Number(right), count);
    } else {
      incrementCount(newValueCounts, value * 2024, count);
    }
  });

  return newValueCounts;
};

const solve = (input: string, iterations: number): number => {
  const numbers = input.split(" ").map(Number);
  let valueCounts = new Map<number, number>();

  numbers.forEach((value) => {
    incrementCount(valueCounts, value, 1);
  });

  for (let i = 0; i < iterations; i++) {
    valueCounts = processIteration(valueCounts);
  }

  let result = 0;
  for (const count of valueCounts.values()) {
    result += count;
  }
  return result;
};

describe("aoc", () => {
  test("demo 1", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve(input, 25)).toEqual(55312);
  });

  test("part 1", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve(input, 25)).toEqual(220722);
  });

  test("part 2", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve(input, 75)).toEqual(261952051690787);
  });
});
