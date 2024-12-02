import { readToString } from '@palpatim/aoc-utils';
import * as path from "node:path";

const solve1 = (input: string): number => {
  return -1;
};

const solve2 = (input: string): number => {
  return -1;
};

describe("aoc", () => {
  test("demo 1", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve1(input)).toEqual(-1);
  });

  test("part 1", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve1(input)).toEqual(-1);
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
