import { readToString } from "@palpatim/aoc-utils";
import * as path from "node:path";

const solve = (input: string, respectConditionals: boolean): number => {
  let result = 0;
  const re = RegExp(/(do\(\)|don't\(\)|mul\((\d+),(\d+)\))/, "g");

  let enabled = true;
  let matches = re.exec(input);

  while (matches) {
    if (respectConditionals && matches[0] === "do()") {
      enabled = true;
    }

    if (respectConditionals && matches[0] === "don't()") {
      enabled = false;
    }

    if (matches[0].startsWith("mul(") && enabled) {
      const a = Number(matches[2]);
      const b = Number(matches[3]);
      result += a * b;
    }

    matches = re.exec(input);
  }

  return result;
};

describe("aoc", () => {
  test("demo 1", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve(input, false)).toEqual(161);
  });

  test("part 1", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve(input, false)).toEqual(174561379);
  });

  test("demo 2", () => {
    const input = readToString(path.join(__dirname, "input-2-demo.txt"));
    expect(solve(input, true)).toEqual(48);
  });

  test("part 2", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve(input, true)).toEqual(106921067);
  });
});
