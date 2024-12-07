import {
  addTwoValues,
  multiplyTwoValues,
  readToString,
} from "@palpatim/aoc-utils";
import * as path from "node:path";

type Operator = (a: number, b: number) => number;

type Partial = (a: number) => number;

const evaluate = (
  target: number,
  partial: Partial,
  operands: number[],
  allowableOperators: Operator[]
): boolean => {
  if (operands.length === 0) {
    throw new Error("No operands provided");
  }

  const value = partial(operands[0]);

  if (operands.length === 1) {
    return value === target;
  }

  const remainder = operands.slice(1);
  for (const op of allowableOperators) {
    const partial = (a: number) => op(value, a);
    if (evaluate(target, partial, remainder, allowableOperators)) {
      return true;
    }
  }

  return false;
};

const solve = (input: string, operators: Operator[]): number => {
  const lines = input.split("\n");

  let result = 0;
  for (const line of lines) {
    const [first, remaining] = line.split(": ");
    const target = Number(first);
    const operands: number[] = remaining.split(" ").map(Number);
    if (evaluate(target, (a) => a, operands, operators)) {
      result += target;
    }
  }

  return result;
};

const concat = (a: number, b: number): number => {
  const aStr = a.toString();
  const bStr = b.toString();
  return Number(aStr + bStr);
};

describe("aoc", () => {
  test("demo 1", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve(input, [multiplyTwoValues, addTwoValues])).toEqual(3749);
  });

  test("part 1", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve(input, [multiplyTwoValues, addTwoValues])).toEqual(
      1038838357795
    );
  });

  test("demo 2", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    expect(solve(input, [multiplyTwoValues, addTwoValues, concat])).toEqual(
      11387
    );
  });

  test("part 2", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    expect(solve(input, [multiplyTwoValues, addTwoValues, concat])).toEqual(254136560217241);
  });
});
