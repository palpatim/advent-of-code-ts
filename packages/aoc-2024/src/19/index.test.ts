import { addTwoValues, readToString } from "@palpatim/aoc-utils";
import * as path from "node:path";

const countCombinations = (
  target: string,
  inventory: Set<string>,
  memo: Map<string, number>
): number => {
  if (target.length === 0) {
    return 1;
  }

  if (memo.has(target)) {
    return memo.get(target)!;
  }

  let count = 0;
  for (const frag of inventory) {
    if (target.startsWith(frag)) {
      count += countCombinations(target.slice(frag.length), inventory, memo);
    }
  }

  memo.set(target, count);
  return count;
};

const solve = (input: string): Record<string, number> => {
  const [inventoryStr, patternStr] = input.split("\n\n");
  const inventory = new Set(inventoryStr.split(", "));
  const patterns = patternStr.split("\n");

  const results: Record<string, number> = {};
  for (const pattern of patterns) {
    results[pattern] = countCombinations(
      pattern,
      inventory,
      new Map<string, number>()
    );
  }

  return results;
};

describe("aoc", () => {
  test("demo", () => {
    const input = readToString(path.join(__dirname, "input-demo.txt"));
    const results = solve(input);
    const reachablePatterns = Object.values(results).filter(
      (r) => r > 0
    ).length;
    const totalCombinations = Object.values(results).reduce(addTwoValues, 0);

    expect(reachablePatterns).toEqual(6);
    expect(totalCombinations).toEqual(16);
  });

  test("real", () => {
    const input = readToString(path.join(__dirname, "input.txt"));
    const results = solve(input);
    const reachablePatterns = Object.values(results).filter(
      (r) => r > 0
    ).length;
    const totalCombinations = Object.values(results).reduce(addTwoValues, 0);

    expect(reachablePatterns).toEqual(213);
    expect(totalCombinations).toEqual(1016700771200474);
  });
});
